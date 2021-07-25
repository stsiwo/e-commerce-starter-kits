package com.iwaodev.infrastructure.model.listener;

import java.util.Set;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import com.iwaodev.infrastructure.model.Product;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import com.iwaodev.exception.AppException;

/**
 * validate product entity before persist/update.
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
public class ProductValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(ProductValidationListener.class);

  /**
   * injecting spring managed bean into JPA issue. see:
   * https://stackoverflow.com/questions/12155632/injecting-a-spring-dependency-into-a-jpa-entitylistener
   *
   * - this works but using repository causes stackoverflow error inside this
   * listener. so stop using this.
   **/
  // private static ValidatorBag<Product> validatorBag;

  // @Autowired
  // public void init(ValidatorBag<Product> validatorBag) {
  // ProductValidationListener.validatorBag = validatorBag;
  // }

  @Autowired
  private Validator validator;

  @PrePersist
  private void beforeCreate(Product domain) throws AppException {
    Set<ConstraintViolation<Product>> constraintViolations = this.validator.validate(domain);
    if (constraintViolations.size() > 0) {
      logger.debug("product has errors...: " + constraintViolations.size());
      throw new AppException(HttpStatus.BAD_REQUEST, constraintViolations.iterator().next().getMessage());
    }
  }

  @PreUpdate
  private void beforeUpdate(Product domain) throws AppException {
    Set<ConstraintViolation<Product>> constraintViolations = this.validator.validate(domain);
    if (constraintViolations.size() > 0) {
      logger.debug("product has errors...: " + constraintViolations.size());
      throw new AppException(HttpStatus.BAD_REQUEST, constraintViolations.iterator().next().getMessage());
    }
  }

}

