package com.iwaodev.domain.user.validator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Company;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserCompanyValidator implements Validator<Company> {

  private static final Logger logger = LoggerFactory.getLogger(UserCompanyValidator.class);

  /**
   * make sure this works.
   **/
  @Autowired
  private CurAuthentication curAuthentication;

  @Override
  public boolean validateWhenBoth(Company domain) throws DomainValidationException {

    logger.info("start UserCompanyValidator");

    if (domain.getCompanyName() == null || domain.getCompanyName().isEmpty()) {
      throw new DomainValidationException(String.format("company name can not be null."));
    }

    if (domain.getCompanyDescription() == null || domain.getCompanyDescription().isEmpty()) {
      throw new DomainValidationException(String.format("company description can not be null."));
    }

    if (domain.getCompanyEmail() == null || domain.getCompanyEmail().isEmpty()) {
      throw new DomainValidationException(String.format("company email can not be null."));
    }

    if (!domain.getCompanyEmail().matches("^(.+)@(.+)$")) {
      throw new DomainValidationException(String.format("company email is invalid format."));
    }

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
    if (!domain.getCountryCode().matches("^+(?:[0-9] ?){6,14}[0-9]$")) {
      throw new DomainValidationException(String.format("phone country code is invalid format."));
    }

    // address 1
    if (domain.getAddress1() == null) {
      throw new DomainValidationException(String.format("address 1 can not be null."));
    }

    // city
    if (domain.getCity() == null) {
      throw new DomainValidationException(String.format("city can not be null."));
    }

    // province
    if (domain.getProvince() == null) {
      throw new DomainValidationException(String.format("province can not be null."));
    }

    // country
    if (domain.getCountry() == null) {
      throw new DomainValidationException(String.format("country can not be null."));
    }

    // country - 2 chars
    if (domain.getCountry().length() != 2) {
      throw new DomainValidationException(String.format("country must be exact 2 chars."));
    }

    // postalCode
    if (domain.getPostalCode() == null) {
      throw new DomainValidationException(String.format("postal code can not be null."));
    }

    // postalCode
    if (!domain.getPostalCode().matches("^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$")) {
      throw new DomainValidationException(String.format("postal code is invalid format."));
    }

    return true;
  }

  @Override
  public boolean validateWhenCreate(Company domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(Company domain) throws DomainValidationException {
    return true;
  }
}
