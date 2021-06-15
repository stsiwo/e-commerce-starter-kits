package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.CartItem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate cartitem entity before persist/update.
 * 
 **/
public class CartItemValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(CartItemValidationListener.class);

  @Autowired
  private ValidatorBag<CartItem> validatorBag;

  @PrePersist
  private void beforeCreate(CartItem cartitem) {
    logger.info("start validating cartitem domain...");
    try {
      this.validatorBag.validateAll(cartitem, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the cartitem domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(CartItem cartitem) {
    logger.info("start validating cartitem domain...");
    try {
      this.validatorBag.validateAll(cartitem, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the cartitem domain passed all validation:)");
  }

}
