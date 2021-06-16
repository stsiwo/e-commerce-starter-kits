package com.iwaodev.domain.user.validator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Phone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserPhoneValidator implements Validator<Phone> {

  private static final Logger logger = LoggerFactory.getLogger(UserPhoneValidator.class);

  /**
   * make sure this works.
   **/
  @Autowired
  private CurAuthentication curAuthentication;

  @Override
  public boolean validateWhenBoth(Phone domain) throws DomainValidationException {

    logger.info("start UserPhoneValidator");

    // phone 1
    if (domain.getPhoneNumber() == null || domain.getPhoneNumber().isEmpty()) {
      throw new DomainValidationException(String.format("phone number can not be null."));
    }

    // phone 1
    if (!domain.getPhoneNumber().matches("^[0-9]{10}$")) {
      throw new DomainValidationException(String.format("phone number is invalid format."));
    }

    // countryCode
    if (domain.getCountryCode() == null || domain.getCountryCode().isEmpty()) {
      throw new DomainValidationException(String.format("phone number can not be null."));
    }

    // countryCode
    if (!domain.getCountryCode().matches("^(\\+?\\d{1,3}|\\d{1,4})$")) {
      throw new DomainValidationException(String.format("phone country code is invalid format."));
    }

    return true;
  }

  @Override
  public boolean validateWhenCreate(Phone domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(Phone domain) throws DomainValidationException {
    return true;
  }
}
