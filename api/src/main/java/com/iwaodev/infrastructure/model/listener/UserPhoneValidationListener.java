package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Phone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate userPhone entity before persist/update.
 * 
 **/
public class UserPhoneValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(UserPhoneValidationListener.class);

  @Autowired
  private ValidatorBag<Phone> validatorBag;

  @PrePersist
  private void beforeCreate(Phone phone) {
    logger.info("start validating phone domain...");
    try {
      this.validatorBag.validateAll(phone, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the phone domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(Phone phone) {
    logger.info("start validating phone domain...");
    try {
      this.validatorBag.validateAll(phone, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the phone domain passed all validation:)");
  }
}
