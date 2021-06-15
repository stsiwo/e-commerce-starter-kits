package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.WishlistItem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate wishlistitem entity before persist/update.
 * 
 **/
public class WishlistItemValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(WishlistItemValidationListener.class);

  @Autowired
  private ValidatorBag<WishlistItem> validatorBag;

  @PrePersist
  private void beforeCreate(WishlistItem wishlistitem) {
    logger.info("start validating wishlistitem domain...");
    try {
      this.validatorBag.validateAll(wishlistitem, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the wishlistitem domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(WishlistItem wishlistitem) {
    logger.info("start validating wishlistitem domain...");
    try {
      this.validatorBag.validateAll(wishlistitem, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the wishlistitem domain passed all validation:)");
  }
}
