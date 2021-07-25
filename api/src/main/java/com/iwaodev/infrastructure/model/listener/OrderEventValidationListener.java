package com.iwaodev.infrastructure.model.listener;

import java.util.Set;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import com.iwaodev.infrastructure.model.OrderEvent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import com.iwaodev.exception.AppException;

/**
 * validate orderevent entity before persist/update.
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
public class OrderEventValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(OrderEventValidationListener.class);

  /**
   * injecting spring managed bean into JPA issue. see:
   * https://stackoverflow.com/questions/12155632/injecting-a-spring-dependency-into-a-jpa-entitylistener
   *
   * - this works but using repository causes stackoverflow error inside this
   * listener. so stop using this.
   **/
  // private static ValidatorBag<OrderEvent> validatorBag;

  // @Autowired
  // public void init(ValidatorBag<OrderEvent> validatorBag) {
  // OrderEventValidationListener.validatorBag = validatorBag;
  // }

  @Autowired
  private Validator validator;

  @PrePersist
  private void beforeCreate(OrderEvent domain) throws AppException {
    Set<ConstraintViolation<OrderEvent>> constraintViolations = this.validator.validate(domain);

    if (constraintViolations.size() > 0) {
      throw new AppException(HttpStatus.BAD_REQUEST, constraintViolations.iterator().next().getMessage());
    }
  }

  @PreUpdate
  private void beforeUpdate(OrderEvent domain) throws AppException {
    Set<ConstraintViolation<OrderEvent>> constraintViolations = this.validator.validate(domain);

    if (constraintViolations.size() > 0) {
      throw new AppException(HttpStatus.BAD_REQUEST, constraintViolations.iterator().next().getMessage());
    }
  }

}

