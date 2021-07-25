package com.iwaodev.application.service;

import java.util.Optional;

import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.ForgotPasswordService;
import com.iwaodev.domain.user.event.GeneratedForgotPasswordTokenEvent;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.ResetPasswordCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ref: https://www.baeldung.com/spring-email-templates
 **/

@Service
@Transactional
public class ForgotPasswordServiceImpl implements ForgotPasswordService {

  private static final Logger logger = LoggerFactory.getLogger(ForgotPasswordServiceImpl.class);

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private ApplicationEventPublisher publisher;

  @Override
  public void requestForgotPassword(String email) throws Exception {

    // find the user by this email
    Optional<User> targetUserOption = this.userRepository.getByEmail(email);


    if (targetUserOption.isPresent()) {
      logger.debug("target forgot password user exist");

      User targetUser = targetUserOption.get();

      targetUser.refreshForgotPasswordToken();

      User savedUser = this.userRepository.save(targetUser);
      this.publisher.publishEvent(new GeneratedForgotPasswordTokenEvent(this, savedUser));
    }
  }

  @Override
  public void resetPassword(ResetPasswordCriteria criteria) throws Exception {

    // find the user by this email
    Optional<User> targetUserOption = this.userRepository.findByForgotPasswordToken(criteria.getToken());

    if (!targetUserOption.isPresent()) {
      /**
       * true message is 'the given user does not exist' but to improve the security, we hide the message and return the below message instead.
       * 
       **/
      logger.debug("the reset password token is not valid.");
      throw new AppException(HttpStatus.BAD_REQUEST, "the reset password token is not valid.");
    }

    User targetUser = targetUserOption.get();

    // token is expired or invalid
    if (!targetUser.verifyForgotPasswordToken(criteria.getToken())) {
      logger.debug("the reset password token is not valid.");
      throw new AppException(HttpStatus.BAD_REQUEST, "the reset password token is not valid.");
    }

    // update password
    targetUser.setPassword(this.passwordEncoder.encode(criteria.getPassword()));

    this.userRepository.save(targetUser);
  }

}
