package com.iwaodev.application.service;

import java.util.Optional;

import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.ForgotPasswordService;
import com.iwaodev.domain.user.event.GeneratedForgotPasswordTokenEvent;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.ResetPasswordCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * ref: https://www.baeldung.com/spring-email-templates
 **/

@Service
public class ForgotPasswordServiceImpl implements ForgotPasswordService, ApplicationEventPublisherAware {

  private static final Logger logger = LoggerFactory.getLogger(ForgotPasswordServiceImpl.class);

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  private ApplicationEventPublisher publisher;

  @Override
  public void setApplicationEventPublisher(ApplicationEventPublisher publisher) {
    this.publisher = publisher;
  }

  @Override
  public void requestForgotPassword(String email) {

    // find the user by this email
    User targetUser = this.userRepository.findByEmail(email);

    if (targetUser != null) {

      targetUser.refreshForgotPasswordToken();

      User savedUser = this.userRepository.save(targetUser);

      this.publisher.publishEvent(new GeneratedForgotPasswordTokenEvent(this, savedUser));
    }
  }

  @Override
  public void resetPassword(ResetPasswordCriteria criteria) {

    // find the user by this email
    Optional<User> targetUserOption = this.userRepository.findByForgotPasswordToken(criteria.getToken());

    if (targetUserOption.isEmpty()) {
      logger.info("the reset password token is not valid.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "the reset password token is not valid.");
    }

    User targetUser = targetUserOption.get();

    // token is expired or invalid
    if (!targetUser.verifyForgotPasswordToken(criteria.getToken())) {
      logger.info("the reset password token is not valid.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "the reset password token is not valid.");
    }

    // update password
    targetUser.setPassword(this.passwordEncoder.encode(criteria.getPassword()));

    this.userRepository.save(targetUser);
  }

}
