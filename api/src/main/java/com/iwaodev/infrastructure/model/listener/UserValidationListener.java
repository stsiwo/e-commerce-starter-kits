package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate user entity before persist/update.
 * 
 **/
public class UserValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(UserValidationListener.class);

  @Autowired
  private ValidatorBag<User> validatorBag;

  @PrePersist
  private void beforeCreate(User user) {
    logger.info("start validating user domain...");
    try {
      this.validatorBag.validateAll(user, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the user domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(User user) {
    logger.info("start validating user domain...");
    try {
      this.validatorBag.validateAll(user, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the user domain passed all validation:)");
  }
}
