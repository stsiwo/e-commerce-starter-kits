package com.iwaodev.domain.order.validator;

import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.OrderAddress;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class OrderAddressValidator implements Validator<OrderAddress> {

  private static final Logger logger = LoggerFactory.getLogger(OrderAddressValidator.class);

  @Override
  public boolean validateWhenBoth(OrderAddress domain) throws DomainValidationException {

    logger.info("start OrderAddressValidator");

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
  public boolean validateWhenCreate(OrderAddress domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(OrderAddress domain) throws DomainValidationException {
    return true;
  }
}
