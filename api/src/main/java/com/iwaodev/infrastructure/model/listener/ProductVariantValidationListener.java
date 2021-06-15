package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.ProductVariant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate productVariant entity before persist/update.
 * 
 **/
public class ProductVariantValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(ProductVariantValidationListener.class);

  @Autowired
  private ValidatorBag<ProductVariant> validatorBag;

  @PrePersist
  private void beforeCreate(ProductVariant productvariant) {
    logger.info("start validating productvariant domain...");
    try {
      this.validatorBag.validateAll(productvariant, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the productvariant domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(ProductVariant productvariant) {
    logger.info("start validating productvariant domain...");
    try {
      this.validatorBag.validateAll(productvariant, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the productvariant domain passed all validation:)");
  }
}
