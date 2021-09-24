package com.iwaodev.application.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.FileService;
import com.iwaodev.application.iservice.S3Service;
import com.iwaodev.application.iservice.UserService;
import com.iwaodev.application.mapper.UserMapper;
import com.iwaodev.application.specification.factory.UserSpecificationFactory;
import com.iwaodev.domain.user.UserActiveEnum;
import com.iwaodev.domain.user.UserSortEnum;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.user.UserCriteria;
import com.iwaodev.ui.criteria.user.UserDeleteTempCriteria;
import com.iwaodev.ui.criteria.user.UserQueryStringCriteria;
import com.iwaodev.ui.criteria.user.UserStatusCriteria;

import com.iwaodev.util.Util;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class UserServiceImpl implements UserService {

  private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

  @Autowired
  private UserRepository repository;

  @Autowired
  private UserSpecificationFactory specificationFactory;

  @Autowired
  private FileService fileService;

  @Value("${file.user.path}")
  private String userFilePath;

  @Value("${file.user.avatarImageName}")
  private String avatarImageName;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private ApplicationEventPublisher publisher;

  @Autowired
  private HttpServletRequest httpServletRequest;

  @Autowired
  private S3Service s3Service;

  public Page<UserDTO> getAll(UserQueryStringCriteria criteria, Integer page, Integer limit, UserSortEnum sort) throws Exception {

    // only return member user type (not include admin user)
    criteria.setUserType(Optional.of(UserTypeEnum.MEMBER));

    // get result with repository
    // and map entity to dto with MapStruct
    return this.repository
        .findAllToAvoidNPlusOne(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
        .map(new Function<User, UserDTO>() {

          @Override
          public UserDTO apply(User user) {
            return UserMapper.INSTANCE.toUserDTO(user);
          }
        });

  }

  @Override
  public UserDTO getById(UUID id) throws Exception {

    // get result with repository
    // and map entity to dto with MapStruct
    Optional<User> targetEntityOption = this.repository.findById(id);

    if (!targetEntityOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // map entity to dto
    return UserMapper.INSTANCE.toUserDTO(targetEntityOption.get());
  }

  @Override
  public UserDTO update(UserCriteria criteria, UUID id) throws Exception {

    // assign id to this criteria id
    // otherwise, this try to create a new User
    criteria.setUserId(id);

    // check user exists
    Optional<User> targetEntityOption = this.repository.findById(id);

    // if not, return 404
    if (!targetEntityOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User targetEntity = targetEntityOption.get();

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetEntity.getVersion(), receivedVersion)) {
      logger.debug("current version: " + targetEntity.getVersion());
      logger.debug("received version: " + receivedVersion);
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    targetEntity.setFirstName(criteria.getFirstName());
    targetEntity.setLastName(criteria.getLastName());

    /**
     * email duplication
     **/
    if (this.repository.isOthersHaveEmail(criteria.getUserId(), criteria.getEmail())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "this email already taken.");
    }

    /**
     * if email is updated, we need to set active = temp and requires the user to verify again.
     */
    if (!targetEntity.getEmail().equals(criteria.getEmail())) {
      targetEntity.setEmail(criteria.getEmail());
      targetEntity.setActive(UserActiveEnum.TEMP);
    }

    /**
     * password might be null/empty since it is optional
     * 
     **/
    if (criteria.getPassword() != null && !criteria.getPassword().isEmpty()) {
      targetEntity.setPassword(this.passwordEncoder.encode(criteria.getPassword()));
    }
    User savedEntity;

    logger.debug("version before update: " + targetEntity.getVersion());

    try {
      // issue-QqMbfkO9pcU
      // issue-YPnuFX8S01a (run 'update' twice because of flush, but need this in production)
      savedEntity = this.repository.saveAndFlush(targetEntity);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    logger.debug("user version after saved: " + savedEntity.getVersion());

    // map entity to dto
    return UserMapper.INSTANCE.toUserDTO(savedEntity);

  }

  @Override
  public UserDTO updateStatus(UserStatusCriteria criteria) throws Exception {

    User user = this.repository.findById(criteria.getUserId())
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND,
            "user not found (id: " + criteria.getUserId().toString() + ")"));


    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");


    logger.debug("curVersion" + user.getVersion());
    logger.debug("recVersion" + receivedVersion);

    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(user.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    user.setActive(criteria.getActive());
    if (criteria.getActiveNote() != null && !criteria.getActiveNote().isEmpty()) {
      user.setActiveNote(criteria.getActiveNote());
    }
    User savedEntity;
    try {
      // issue-j845jixIPCn
      // don't forget flush otherwise version number is updated.
      savedEntity = this.repository.saveAndFlush(user);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    // map entity to dto
    return UserMapper.INSTANCE.toUserDTO(savedEntity);
  }

  @Override
  public void tempDelete(UserDeleteTempCriteria criteria, UUID id) throws Exception {
    // not delete the record, but update 'isDeleted' column

    Optional<User> targetEntityOption = this.repository.findById(id);

    if (!targetEntityOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User targetEntity = targetEntityOption.get();

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetEntity.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    // update related properties
    targetEntity.setActive(UserActiveEnum.CUSTOMER_DELETED);
    targetEntity.setActiveNote("the customer requested for the deletion of the account ("
        + LocalDateTime.now().format(DateTimeFormatter.ofLocalizedDate(FormatStyle.FULL)) + ")");

    try {
      this.repository.save(targetEntity);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

  }

  @Override
  public void delete(UUID id) throws Exception {
    // completely delete user data
    Optional<User> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isPresent()) {
      User targetEntity = targetEntityOption.get();

      logger.debug("curVersion" + targetEntity.getVersion());

      // version check for concurrency update
      String receivedVersion = this.httpServletRequest.getHeader("If-Match");
      if (receivedVersion == null || receivedVersion.isEmpty()) {
        throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
      }
      if (!Util.checkETagVersion(targetEntity.getVersion(), receivedVersion)) {
        throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
      };

      // delete s3 directory of this user also.
      String userDirectoryKey = this.userFilePath + "/" + targetEntity.getUserId().toString();
      this.s3Service.delete(userDirectoryKey);

      try {
        this.repository.delete(targetEntity);
      } catch (OptimisticLockingFailureException ex) {
        throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
      }
    }
  }

  @Override
  public UserDTO uploadAvatarImage(UUID userId, MultipartFile file) throws Exception {

    // find the user
    Optional<User> targetEntityOption = this.repository.findById(userId);

    if (!targetEntityOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // update the user
    User targetEntity = targetEntityOption.get();

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetEntity.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    // check the file content type (only image is allowed)
    if (!this.fileService.isImage(file)) {
      logger.debug("only image files are acceptable.");
      throw new AppException(HttpStatus.BAD_REQUEST, "only image files are acceptable.");
    }

    // generate unique (including hash for cache) file name
    String newFileName = this.fileService.generateHashedFileName(file.getOriginalFilename());

    // construct path
    String directoryPath = getDirectoryPath(userId.toString());
    String path = directoryPath + "/" + newFileName;

    // try to save teh file
    try {
      // if the previous image exists, remove from s3
      if (targetEntity.getAvatarImagePath() != null && !targetEntity.getAvatarImagePath().isEmpty()) {
        String oldPath = this.switchToDirectoryPathWithFile(targetEntity.getAvatarImagePath(), userId.toString());
        logger.debug("old image path to s3: " + oldPath);
        this.s3Service.delete(oldPath);
      }
      //this.fileService.save(path, file);
      this.s3Service.upload(path, file.getBytes());
    } catch (Exception e) {
      logger.debug(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "encountered errors during uploading user avatar images. please try again.");
    }


    String publicPath = getPublicDirectoryPath(targetEntity.getUserId().toString()) + "/" + newFileName;

    targetEntity.setAvatarImagePath(publicPath);

    User savedEntity;
    try {
      // don't forget flush otherwise version number is updated.
      savedEntity = this.repository.saveAndFlush(targetEntity);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    // map entity to dto
    return UserMapper.INSTANCE.toUserDTO(savedEntity);
  }

  @Override
  public UserDTO removeAvatarImage(UUID userId) throws Exception {

    // find the user
    Optional<User> targetEntityOption = this.repository.findById(userId);

    if (!targetEntityOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // get avatarImagePath from db
    User targetEntity = targetEntityOption.get();

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetEntity.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    String avatarImagePath = targetEntity.getAvatarImagePath();

    User savedEntity = targetEntity;

    // if it is empty, we don't have any image to delete.
    if (avatarImagePath != null && !avatarImagePath.isEmpty()) {

      String directoryPathWithFile = this.switchToDirectoryPathWithFile(avatarImagePath,
          targetEntity.getUserId().toString());

      // remove from the directory
      this.s3Service.delete(directoryPathWithFile);

      // update user entity to remove avatarImagePath
      targetEntity.setAvatarImagePath(null);

      try {
        savedEntity = this.repository.saveAndFlush(targetEntity);
      } catch (OptimisticLockingFailureException ex) {
        throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
      }
    } else {
      logger.debug("image path is empty so we don't have any image to delete.");
    }

    return UserMapper.INSTANCE.toUserDTO(savedEntity);
  }

  private String getDirectoryPath(String userIdString) {
    return this.userFilePath + "/" + userIdString;
  }

  private String getPublicDirectoryPath(String userIdString) {
    return this.userFilePath + "/" + userIdString + "/avatar-image";
  }

  private String updateFileName(String originalFileName) {
    return this.avatarImageName + "." + this.fileService.getExtension(originalFileName);
  }

  private String switchToDirectoryPathWithFile(String publicPath, String userIdString) throws Exception {
    return getDirectoryPath(userIdString) + "/" + this.fileService.extractFileNameFromPath(publicPath);
  }

  @Override
  public byte[] getAvatarImage(UUID userId, String imageName) throws Exception {

    String internalPath = this.userFilePath + "/" + userId.toString() + "/" + imageName;

    logger.debug("ineternal path: " + internalPath);

    byte[] content = null;

    try {
      //content = this.fileService.load(internalPath);
      content = this.s3Service.get(internalPath);
    } catch (Exception e) {
      logger.debug(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "encountered errors during retrieving user avatar image from s3. please try again.");
    }

    return content;
  }

  private Sort getSort(UserSortEnum sortEnum) {

    if (sortEnum == UserSortEnum.DATE_DESC) {
      return Sort.by("createdAt").descending();
    } else if (sortEnum == UserSortEnum.DATE_ASC) {
      return Sort.by("createdAt").ascending();
    } else if (sortEnum == UserSortEnum.ALPHABETIC_ASC) {
      return Sort.by("firstName").ascending();
    } else {
      return Sort.by("firstName").descending();
    }
  }

}
