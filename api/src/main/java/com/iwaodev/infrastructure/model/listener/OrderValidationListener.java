package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Order;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate order entity before persist/update.
 * 
 **/
public class OrderValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(OrderValidationListener.class);

  @Autowired
  private ValidatorBag<Order> validatorBag;

  @PrePersist
  private void beforeCreate(Order order) {
    logger.info("start validating order domain...");
    try {
      this.validatorBag.validateAll(order, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the order domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(Order order) {
    logger.info("start validating order domain...");
    try {
      this.validatorBag.validateAll(order, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the order domain passed all validation:)");
  }
}
