package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Category;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate category entity before persist/update.
 * 
 **/
@Component
public class CategoryValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(CategoryValidationListener.class);

  //@Autowired
  //private ValidatorBag<Category> validatorBag;
  
  private static ValidatorBag<Category> validatorBag;

  @Autowired
  public void init(ValidatorBag<Category> validatorBag) {
    CategoryValidationListener.validatorBag = validatorBag;
    logger.info("Initializing with dependency [" + validatorBag + "]");
  }
  //@Autowired
  //private CategoryRepository categoryRepository; 

  @PrePersist
  private void beforeCreate(Category category) {
    logger.info("start validating category domain...");
    try {
      //logger.info("" + this.categoryRepository);
      logger.info("repository is not null");
      logger.info("" + this.validatorBag);
      logger.info("validatorBag is not null");
      this.validatorBag.validateAll(category, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the category domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(Category category) {
    logger.info("start validating category domain...");
    try {
      logger.info("" + this.validatorBag);
      logger.info("validatorBag is not null");
      this.validatorBag.validateAll(category, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the category domain passed all validation:)");
  }
}
