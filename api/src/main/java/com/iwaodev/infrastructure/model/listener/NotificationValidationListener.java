package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate notification entity before persist/update.
 * 
 **/
@Component
public class NotificationValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(NotificationValidationListener.class);

  /**
   * injecting spring managed bean into JPA issue.
   * see: https://stackoverflow.com/questions/12155632/injecting-a-spring-dependency-into-a-jpa-entitylistener
   **/
  private static ValidatorBag<Notification> validatorBag;

  @Autowired
  public void init(ValidatorBag<Notification> validatorBag) {
    NotificationValidationListener.validatorBag = validatorBag;
    logger.info("Initializing with dependency [" + validatorBag + "]");
  }
  @PrePersist
  private void beforeCreate(Notification notification) {
    logger.info("start validating notification domain...");
    try {
      logger.info("" + this.validatorBag);
      logger.info("validatorBag is not null");
      this.validatorBag.validateAll(notification, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the notification domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(Notification notification) {
    logger.info("start validating notification domain...");
    try {
      logger.info("" + this.validatorBag);
      logger.info("validatorBag is not null");
      this.validatorBag.validateAll(notification, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the notification domain passed all validation:)");
  }
}
