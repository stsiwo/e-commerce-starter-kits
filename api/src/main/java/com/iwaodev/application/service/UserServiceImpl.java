package com.iwaodev.application.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.FileService;
import com.iwaodev.application.iservice.UserService;
import com.iwaodev.application.mapper.UserMapper;
import com.iwaodev.application.specification.factory.UserSpecificationFactory;
import com.iwaodev.domain.user.UserSortEnum;
import com.iwaodev.infrastructure.model.Phone;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.UserCriteria;
import com.iwaodev.ui.criteria.UserDeleteTempCriteria;
import com.iwaodev.ui.criteria.UserQueryStringCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImpl implements UserService, ApplicationEventPublisherAware {

  private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

  private UserRepository repository;

  private UserSpecificationFactory specificationFactory;

  private FileService fileService;

  private String userFilePath;

  private String avatarImageName;

  private ApplicationEventPublisher publisher;

  @Autowired
  public UserServiceImpl(UserRepository repository, UserSpecificationFactory specificationFactory,
      FileService fileService, @Value("${file.user.path}") String userFilePath,
      @Value("${file.user.avatarImageName}") String avatarImageName) {
    this.repository = repository;
    this.specificationFactory = specificationFactory;
    this.fileService = fileService;
    this.userFilePath = userFilePath;
    this.avatarImageName = avatarImageName;
  }

  @Override
  public void setApplicationEventPublisher(ApplicationEventPublisher publisher) {
    this.publisher = publisher;
  }

  public Page<UserDTO> getAll(UserQueryStringCriteria criteria, Integer page, Integer limit, UserSortEnum sort) {

    // get result with repository
    // and map entity to dto with MapStruct
    return this.repository
        .findAll(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
        .map(new Function<User, UserDTO>() {

          @Override
          public UserDTO apply(User user) {

            // lazy loading.. this cause n+1 problem.
            // TODO: fix this.
            user.getAddresses();
            user.getPhones();
            user.getOrders();
            user.getReviews();

            return UserMapper.INSTANCE.toUserDTO(user);
          }
        });

  }

  @Override
  public UserDTO getById(UUID id) {

    // get result with repository
    // and map entity to dto with MapStruct
    Optional<User> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // map entity to dto
    return UserMapper.INSTANCE.toUserDTO(targetEntityOption.get());
  }

  @Override
  public UserDTO update(UserCriteria criteria, UUID id) {

    // assign id to this criteria id
    // otherwise, this try to create a new User
    criteria.setUserId(id);

    logger.info("target criteria: " + criteria.toString());

    // check user exists
    Optional<User> targetEntityOption = this.repository.findById(id);

    // if not, return 404
    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User targetEntity = targetEntityOption.get();

    targetEntity.setFirstName(criteria.getFirstName());
    targetEntity.setLastName(criteria.getLastName());
    targetEntity.setEmail(criteria.getEmail());

    /**
     * password might be null/empty since it is optional
     * 
     **/
    if (criteria.getPassword() != null && !criteria.getPassword().isEmpty()) {
      targetEntity.setPassword(criteria.getPassword());
    }

    User savedEntity = this.repository.save(targetEntity);

    logger.info("password (make sure this never gonna be null): " + savedEntity.getPassword());

    // map entity to dto
    return UserMapper.INSTANCE.toUserDTO(savedEntity);

  }

  @Override
  public void tempDelete(UserDeleteTempCriteria criteria, UUID id) {
    // not delete the record, but update 'isDeleted' column

    Optional<User> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    User targetEntity = targetEntityOption.get();

    // update related properties
    targetEntity.setIsDeleted(true);
    targetEntity.setDeletedAccountDate(LocalDateTime.now());
    targetEntity.setDeletedAccountReason(criteria.getDeletedAccountReason());

    this.repository.save(targetEntity);
  }

  @Override
  public void delete(UUID id) {
    // completely delete user data
    Optional<User> targetEntityOption = this.repository.findById(id);

    if (!targetEntityOption.isEmpty()) {
      User targetEntity = targetEntityOption.get();
      this.repository.delete(targetEntity);
    }
  }

  @Override
  @Deprecated
  public boolean isSameAsAuthenticatedUser(org.springframework.security.core.userdetails.User authUser, UUID id) {

    // get result with repository
    // and map entity to dto with MapStruct
    Optional<User> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    logger.info("auth user email: " + authUser.getUsername());
    logger.info("target user email: " + targetEntityOption.get().getEmail());

    /**
     * don't confused with 'getUsername()'. it contains the email of the user.
     **/
    return authUser.getUsername() == targetEntityOption.get().getEmail();
  }

  @Override
  public String uploadAvatarImage(UUID userId, MultipartFile file) {

    // find the user
    Optional<User> targetEntityOption = this.repository.findById(userId);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // check the file content type (only image is allowed)
    if (!this.fileService.isImage(file)) {
      logger.info("only image files are acceptable.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "only image files are acceptable.");
    }

    // construct path
    String directoryPath = getDirectoryPath(userId.toString());
    String fileName = updateFileName(file.getOriginalFilename());
    String path = directoryPath + "/" + fileName;

    logger.info("directory path: " + directoryPath);
    logger.info("file name: " + fileName);
    logger.info("path to this file: " + path);

    // try to save teh file
    try {
      this.fileService.save(path, file);
    } catch (IOException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    // update the user
    User targetEntity = targetEntityOption.get();

    String publicPath = getPublicDirectoryPath(targetEntity.getUserId().toString()) + "/" + fileName;

    logger.info("public path: " + publicPath);

    targetEntity.setAvatarImagePath(publicPath);

    User savedEntity = this.repository.save(targetEntity);

    return savedEntity.getAvatarImagePath();
  }

  @Override
  public void removeAvatarImage(UUID userId) {

    // find the user
    Optional<User> targetEntityOption = this.repository.findById(userId);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
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
    return "/users/" + userIdString + "/avatar-image";
  }

  private String updateFileName(String originalFileName) {
    return this.avatarImageName + "." + this.fileService.getExtension(originalFileName);
  }

  private String switchToDirectoryPathWithFile(String publicPath, String userIdString) {
    return getDirectoryPath(userIdString) + "/" + this.fileService.extractFileNameFromPath(publicPath);
  }

  @Override
  public byte[] getAvatarImage(UUID userId, String imageName) {

    String internalPath = this.userFilePath + "/" + userId.toString() + "/" + imageName;

    byte[] content = null;

    try {
      content = this.fileService.load(internalPath);
    } catch (IOException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
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