package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.OrderAddress;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate orderaddress entity before persist/update.
 * 
 **/
public class OrderAddressValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(OrderAddressValidationListener.class);

  @Autowired
  private ValidatorBag<OrderAddress> validatorBag;

  @PrePersist
  private void beforeCreate(OrderAddress orderaddress) {
    logger.info("start validating orderaddress domain...");
    try {
      this.validatorBag.validateAll(orderaddress, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the orderaddress domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(OrderAddress orderaddress) {
    logger.info("start validating orderaddress domain...");
    try {
      this.validatorBag.validateAll(orderaddress, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the orderaddress domain passed all validation:)");
  }
}
