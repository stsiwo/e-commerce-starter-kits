package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Address;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate userAddress entity before persist/update.
 * 
 **/
public class UserAddressValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(UserAddressValidationListener.class);

  @Autowired
  private ValidatorBag<Address> validatorBag;

  @PrePersist
  private void beforeCreate(Address address) {
    logger.info("start validating address domain...");
    try {
      this.validatorBag.validateAll(address, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the address domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(Address address) {
    logger.info("start validating address domain...");
    try {
      this.validatorBag.validateAll(address, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the address domain passed all validation:)");
  }
}
