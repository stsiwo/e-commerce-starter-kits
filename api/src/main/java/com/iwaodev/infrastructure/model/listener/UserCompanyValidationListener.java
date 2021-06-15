package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Company;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * validate userCompany entity before persist/update.
 * 
 **/
public class UserCompanyValidationListener {

  private static final Logger logger = LoggerFactory.getLogger(UserCompanyValidationListener.class);

  @Autowired
  private ValidatorBag<Company> validatorBag;

  @PrePersist
  private void beforeCreate(Company company) {
    logger.info("start validating company domain...");
    try {
      this.validatorBag.validateAll(company, "create");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the company domain passed all validation:)");
  }
  
  @PreUpdate
  private void beforeUpdate(Company company) {
    logger.info("start validating company domain...");
    try {
      this.validatorBag.validateAll(company, "update");
    } catch (DomainValidationException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    logger.info("the company domain passed all validation:)");
  }
}
