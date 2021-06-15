package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Review;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate review entity before persist/update.
 * 
 **/
public class ReviewValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(ReviewValidationListener.class);

  @Autowired
  private ValidatorBag<Review> validatorBag;

  @PrePersist
  private void beforeCreate(Review review) {
    logger.info("start validating review domain...");
    try {
      this.validatorBag.validateAll(review, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the review domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(Review review) {
    logger.info("start validating review domain...");
    try {
      this.validatorBag.validateAll(review, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the review domain passed all validation:)");
  }
}
