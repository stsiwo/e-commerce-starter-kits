package com.iwaodev.application.service;

import java.util.UUID;

import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.UserSignupService;
import com.iwaodev.application.mapper.UserMapper;
import com.iwaodev.domain.user.UserActiveEnum;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.user.event.GeneratedVerificationTokenEvent;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.model.UserType;
import com.iwaodev.ui.criteria.user.UserSignupCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class UserSignupServiceImpl implements UserSignupService {

  private static final Logger logger = LoggerFactory.getLogger(UserSignupServiceImpl.class);

  @Autowired
  private UserRepository repository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private ApplicationEventPublisher publisher;

  public UserDTO signup(UserSignupCriteria criteria) {

    logger.info("target criteria user name: " + criteria.toString());

    if (this.repository.findByEmail(criteria.getEmail()).isPresent()) {
      logger.info("the given user already exisxts");
      throw new ResponseStatusException(HttpStatus.CONFLICT, "the given user already exists.");
    }


    // user does not exist, so create new one.

    // map request criteria to entity
    User targetEntity = UserMapper.INSTANCE.toUserEntityFromUserSignupCriteria(criteria);

    // assign user type
    UserType memberType = this.repository.findUserType(UserTypeEnum.MEMBER).orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "user type not found (type: MEMBER)"));
    targetEntity.setUserType(memberType);

    // set bcrypted password
    targetEntity.setPassword(this.passwordEncoder.encode(criteria.getPassword()));

    // set active to temp'
    targetEntity.setActive(UserActiveEnum.TEMP);
    
    logger.info("target user name: " + targetEntity.getFirstName());

    /**
     * generte a verification token to activate this account
     * 
     **/
    targetEntity.refreshVerificationToken();

    // signup with repository
    // #TODO: throw exception with 409
    User savedEntity = this.repository.save(targetEntity);

    this.publisher.publishEvent(new GeneratedVerificationTokenEvent(this, savedEntity));

    // map entity to dto
    return UserMapper.INSTANCE.toUserDTO(savedEntity);
  }

  @Override
  public UserDTO verifyAccount(UUID userId, String verificationToken) {

    User targetUser = this.repository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "the user not found (id: " + userId.toString() + ")"));

    if (targetUser.isActive()) {
      logger.info("your account is already verified.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "your account is already verified.");
    }

    if (!targetUser.verifyVerificationToken(verificationToken)) {
      logger.info("verification token is invalid because of wrong value or expired.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "verification token is invalid because of wrong value or expired.");
    }

    targetUser.setActive(UserActiveEnum.ACTIVE);

    User activatedUser = this.repository.save(targetUser);

    return UserMapper.INSTANCE.toUserDTO(activatedUser);
  }

  @Override
  public UserDTO reissueVerification(UUID userId) {


    User targetUser = this.repository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "the user not found (id: " + userId.toString() + ")"));

    if (targetUser.isActive()) {
      logger.info("your account is already verified.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "your account is already verified.");
    }

    targetUser.refreshVerificationToken();

    // dispatch an event (e.g., reissue verification token event)
    User refreshedUser = this.repository.save(targetUser);

    this.publisher.publishEvent(new GeneratedVerificationTokenEvent(this, refreshedUser));

    return UserMapper.INSTANCE.toUserDTO(refreshedUser);
  }

}
