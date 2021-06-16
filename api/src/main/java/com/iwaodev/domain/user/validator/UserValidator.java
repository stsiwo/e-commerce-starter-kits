package com.iwaodev.domain.user.validator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserValidator implements Validator<User> {

  private static final Logger logger = LoggerFactory.getLogger(UserValidator.class);

  /**
   * make sure this works.
   **/
  @Autowired
  private CurAuthentication curAuthentication;

  @Override
  public boolean validateWhenBoth(User domain) throws DomainValidationException {

    logger.info("start UserValidator");

    // first name
    if (domain.getFirstName() == null) {
      throw new DomainValidationException(String.format("user first name cannot be null."));
    }

    // last name
    if (domain.getLastName() == null) {
      throw new DomainValidationException(String.format("user last name cannot be null."));
    }

    // email
    if (domain.getEmail() == null) {
      throw new DomainValidationException(String.format("user email cannot be null."));
    }

    // password
    if (domain.getPassword() == null) {
      throw new DomainValidationException(String.format("user password cannot be null."));
    }

    // guess no way to check string is bcrypted password or not.
    // TODO: any idea?

    // userType
    if (domain.getUserType() == null) {
      throw new DomainValidationException(String.format("user type cannot be null."));
    }

    // active
    if (domain.getActive() == null) {
      throw new DomainValidationException(String.format("user active cannot be null."));
    }

    logger.info("total address size");
    logger.info("" + domain.getAddresses().size());

    // address max 3
    if (domain.getAddresses().size() > 3) {
      throw new DomainValidationException(String.format("user addresses must be less than or equal to 3."));
    }

    // phones max 3
    if (domain.getPhones().size() > 3) {
      throw new DomainValidationException(String.format("user phones must be less than or equal to 3."));
    }

    return true;
  }

  @Override
  public boolean validateWhenCreate(User domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(User domain) throws DomainValidationException {
    return true;
  }
}
