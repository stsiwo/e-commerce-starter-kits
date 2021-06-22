package com.iwaodev.infrastructure.model.listener;

import java.util.Set;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import com.iwaodev.infrastructure.model.Review;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate review entity before persist/update.
 *
 * issues:
 *
 * injecting spring managed bean into JPA issue. see:
 * https://stackoverflow.com/questions/12155632/injecting-a-spring-dependency-into-a-jpa-entitylistener
 *
 * - this works but using repository causes stackoverflow error inside this
 * listener. so stop using this.
 * 
 **/
@Component
public class ReviewValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(ReviewValidationListener.class);

  /**
   * injecting spring managed bean into JPA issue. see:
   * https://stackoverflow.com/questions/12155632/injecting-a-spring-dependency-into-a-jpa-entitylistener
   *
   * - this works but using repository causes stackoverflow error inside this
   * listener. so stop using this.
   **/
  // private static ValidatorBag<Review> validatorBag;

  // @Autowired
  // public void init(ValidatorBag<Review> validatorBag) {
  // ReviewValidationListener.validatorBag = validatorBag;
  // logger.info("Initializing with dependency [" + validatorBag + "]");
  // }

  @Autowired
  private Validator validator;

  @PrePersist
  private void beforeCreate(Review domain) {
    logger.info("start validating domain for create...");
    Set<ConstraintViolation<Review>> constraintViolations = this.validator.validate(domain);

    if (constraintViolations.size() > 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, constraintViolations.iterator().next().getMessage());
    }
  }

  @PreUpdate
  private void beforeUpdate(Review domain) {
    logger.info("start validating domain for update...");
    Set<ConstraintViolation<Review>> constraintViolations = this.validator.validate(domain);

    if (constraintViolations.size() > 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, constraintViolations.iterator().next().getMessage());
    }
    logger.info("the domain passed all validation:)");
  }

}

