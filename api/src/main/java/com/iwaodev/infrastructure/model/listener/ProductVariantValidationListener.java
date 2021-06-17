package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.ProductVariant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate productVariant entity before persist/update.
 * 
 **/
@Component
public class ProductVariantValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(ProductVariantValidationListener.class);

  /**
   * injecting spring managed bean into JPA issue.
   * see: https://stackoverflow.com/questions/12155632/injecting-a-spring-dependency-into-a-jpa-entitylistener
   **/
  private static ValidatorBag<ProductVariant> validatorBag;

  @Autowired
  public void init(ValidatorBag<ProductVariant> validatorBag) {
    ProductVariantValidationListener.validatorBag = validatorBag;
    logger.info("Initializing with dependency [" + validatorBag + "]");
  }
  @PrePersist
  private void beforeCreate(ProductVariant productvariant) {
    logger.info("start validating productvariant domain for create...");
    try {
      logger.info("" + this.validatorBag);
      logger.info("validatorBag is not null");
      this.validatorBag.validateAll(productvariant, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the productvariant domain passed all validation for create:)");
  }
  
  @PreUpdate
  private void beforeUpdate(ProductVariant productvariant) {
    logger.info("start validating productvariant domain for update...");
    try {
      logger.info("" + this.validatorBag);
      logger.info("validatorBag is not null");
      this.validatorBag.validateAll(productvariant, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the productvariant domain passed all validation for update:)");
  }
}
