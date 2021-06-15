package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.OrderDetail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate orderdetail entity before persist/update.
 * 
 **/
public class OrderDetailValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(OrderDetailValidationListener.class);

  @Autowired
  private ValidatorBag<OrderDetail> validatorBag;

  @PrePersist
  private void beforeCreate(OrderDetail orderdetail) {
    logger.info("start validating orderdetail domain...");
    try {
      this.validatorBag.validateAll(orderdetail, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the orderdetail domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(OrderDetail orderdetail) {
    logger.info("start validating orderdetail domain...");
    try {
      this.validatorBag.validateAll(orderdetail, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the orderdetail domain passed all validation:)");
  }
}
