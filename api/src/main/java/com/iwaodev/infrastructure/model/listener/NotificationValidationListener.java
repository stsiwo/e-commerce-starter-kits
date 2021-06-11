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
import org.springframework.web.server.ResponseStatusException;

/**
 * validate notification entity before persist/update.
 * 
 **/
public class NotificationValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(NotificationValidationListener.class);

  @Autowired
  private ValidatorBag<Notification> validatorBag;

  @PrePersist
  @PreUpdate
  private void beforeAnyUpdate(Notification notification) {
    logger.info("start validating notification domain...");
    try {
      this.validatorBag.validateAll(notification);
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the notification domain passed all validation:)");
  }

}
