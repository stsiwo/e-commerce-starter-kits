package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.OrderEvent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate orderevent entity before persist/update.
 * 
 **/
public class OrderEventValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(OrderEventValidationListener.class);

  @Autowired
  private ValidatorBag<OrderEvent> validatorBag;

  @PrePersist
  private void beforeCreate(OrderEvent orderevent) {
    logger.info("start validating orderevent domain...");
    try {
      this.validatorBag.validateAll(orderevent, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the orderevent domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(OrderEvent orderevent) {
    logger.info("start validating orderevent domain...");
    try {
      this.validatorBag.validateAll(orderevent, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the orderevent domain passed all validation:)");
  }
}
