package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Product;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate product entity before persist/update.
 * 
 **/
public class ProductValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(ProductValidationListener.class);

  @Autowired
  private ValidatorBag<Product> validatorBag;

  @PrePersist
  private void beforeCreate(Product product) {
    logger.info("start validating product domain...");
    try {
      this.validatorBag.validateAll(product, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the product domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(Product product) {
    logger.info("start validating product domain...");
    try {
      this.validatorBag.validateAll(product, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the product domain passed all validation:)");
  }
}
