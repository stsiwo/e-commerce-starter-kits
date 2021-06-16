package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.ProductImage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate productImage entity before persist/update.
 * 
 **/
public class ProductImageValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(ProductImageValidationListener.class);

  @Autowired
  private ValidatorBag<ProductImage> validatorBag;

  @PrePersist
  private void beforeCreate(ProductImage productimage) {
    logger.info("start validating productimage domain...");
    try {
      this.validatorBag.validateAll(productimage, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the productimage domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(ProductImage productimage) {
    logger.info("start validating productimage domain...");
    try {
      this.validatorBag.validateAll(productimage, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the productimage domain passed all validation:)");
  }
}
