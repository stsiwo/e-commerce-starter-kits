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
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.user.UserCriteria;
import com.iwaodev.ui.criteria.user.UserDeleteTempCriteria;
import com.iwaodev.ui.criteria.user.UserQueryStringCriteria;
import com.iwaodev.ui.criteria.user.UserStatusCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
  private S3Service s3Service;

  public Page<UserDTO> getAll(UserQueryStringCriteria criteria, Integer page, Integer limit, UserSortEnum sort) throws Exception {

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

    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
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

    logger.info("target criteria: " + criteria.toString());

    // check user exists
    Optional<User> targetEntityOption = this.repository.findById(id);

    // if not, return 404
    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User targetEntity = targetEntityOption.get();

    targetEntity.setFirstName(criteria.getFirstName());
    targetEntity.setLastName(criteria.getLastName());

    /**
     * email duplication
     **/
    if (this.repository.isOthersHaveEmail(criteria.getUserId(), criteria.getEmail())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "this email already taken.");
    }

    targetEntity.setEmail(criteria.getEmail());

    /**
     * password might be null/empty since it is optional
     * 
     **/
    if (criteria.getPassword() != null && !criteria.getPassword().isEmpty()) {
      targetEntity.setPassword(this.passwordEncoder.encode(criteria.getPassword()));
    }

    User savedEntity = this.repository.save(targetEntity);

    logger.info("password (make sure this never gonna be null): " + savedEntity.getPassword());

    // map entity to dto
    return UserMapper.INSTANCE.toUserDTO(savedEntity);

  }

  @Override
  public UserDTO updateStatus(UserStatusCriteria criteria) throws Exception {

    User user = this.repository.findById(criteria.getUserId())
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND,
            "user not found (id: " + criteria.getUserId().toString() + ")"));

    user.setActive(criteria.getActive());
    if (criteria.getActiveNote() != null && !criteria.getActiveNote().isEmpty()) {
      user.setActiveNote(criteria.getActiveNote());
    }

    User savedEntity = this.repository.save(user);

    // map entity to dto
    return UserMapper.INSTANCE.toUserDTO(savedEntity);
  }

  @Override
  public void tempDelete(UserDeleteTempCriteria criteria, UUID id) throws Exception {
    // not delete the record, but update 'isDeleted' column

    Optional<User> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User targetEntity = targetEntityOption.get();

    // update related properties
    targetEntity.setActive(UserActiveEnum.CUSTOMER_DELETED);
    targetEntity.setActiveNote("the customer requested for the deletion of the account ("
        + LocalDateTime.now().format(DateTimeFormatter.ofLocalizedDate(FormatStyle.FULL)) + ")");

    this.repository.save(targetEntity);

  }

  @Override
  public void delete(UUID id) throws Exception {
    // completely delete user data
    Optional<User> targetEntityOption = this.repository.findById(id);

    if (!targetEntityOption.isEmpty()) {
      User targetEntity = targetEntityOption.get();
      // delete s3 directory of this user also.
      String userDirectoryKey = this.userFilePath + "/" + targetEntity.getUserId().toString();
      this.s3Service.delete(userDirectoryKey);
      this.repository.delete(targetEntity);
    }
  }

  @Override
  @Deprecated
  public boolean isSameAsAuthenticatedUser(org.springframework.security.core.userdetails.User authUser, UUID id) throws Exception {

    // get result with repository
    // and map entity to dto with MapStruct
    Optional<User> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    logger.info("auth user email: " + authUser.getUsername());
    logger.info("target user email: " + targetEntityOption.get().getEmail());

    /**
     * don't confused with 'getUsername()'. it contains the email of the user.
     **/
    return authUser.getUsername() == targetEntityOption.get().getEmail();
  }

  @Override
  public String uploadAvatarImage(UUID userId, MultipartFile file) throws Exception {

    // find the user
    Optional<User> targetEntityOption = this.repository.findById(userId);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // check the file content type (only image is allowed)
    if (!this.fileService.isImage(file)) {
      logger.info("only image files are acceptable.");
      throw new AppException(HttpStatus.BAD_REQUEST, "only image files are acceptable.");
    }

    // generate unique (including hash for cache) file name
    String newFileName = this.fileService.generateHashedFileName(file.getOriginalFilename());

    // construct path
    String directoryPath = getDirectoryPath(userId.toString());
    String fileName = updateFileName(newFileName);
    String path = directoryPath + "/" + newFileName;

    logger.info("directory path: " + directoryPath);
    logger.info("file name: " + newFileName);
    logger.info("path to this file: " + path);

    // try to save teh file
    try {
      //this.fileService.save(path, file);
      this.s3Service.upload(path, file.getBytes());
    } catch (Exception e) {
      logger.info(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    // update the user
    User targetEntity = targetEntityOption.get();

    String publicPath = getPublicDirectoryPath(targetEntity.getUserId().toString()) + "/" + newFileName;

    logger.info("public path: " + publicPath);

    targetEntity.setAvatarImagePath(publicPath);

    User savedEntity = this.repository.save(targetEntity);

    return savedEntity.getAvatarImagePath();
  }

  @Override
  public void removeAvatarImage(UUID userId) throws Exception {

    // find the user
    Optional<User> targetEntityOption = this.repository.findById(userId);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // get avatarImagePath from db
    User targetEntity = targetEntityOption.get();
    String avatarImagePath = targetEntity.getAvatarImagePath();

    // if it is empty, we don't have any image to delete.
    if (avatarImagePath != null && !avatarImagePath.isEmpty()) {

      logger.info("public image path: " + avatarImagePath);

      String directoryPathWithFile = this.switchToDirectoryPathWithFile(avatarImagePath,
          targetEntity.getUserId().toString());

      logger.info("directory image path: " + directoryPathWithFile);

      // remove from the directory
      boolean isSuccess = this.fileService.remove(directoryPathWithFile);

      logger.info("avatar image file succeed? " + isSuccess);

      // update user entity to remove avatarImagePath
      targetEntity.setAvatarImagePath(null);

      this.repository.save(targetEntity);
    } else {
      logger.info("image path is empty so we don't have any image to delete.");
    }
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

    logger.info("ineternal path: " + internalPath);

    byte[] content = null;

    try {
      //content = this.fileService.load(internalPath);
      content = this.s3Service.get(internalPath);
    } catch (Exception e) {
      logger.info(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
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
