package com.iwaodev.domain.user.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.infrastructure.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * don't use this at any JPA class (e.g., Entity class, EntityListner).
 *
 **/
// if this is used by another package, don't forget to add 'public' otherwise, they cannot access.
@Component
public class UserValidationValidator implements ConstraintValidator<UserValidation, User> {

  private static final Logger logger = LoggerFactory.getLogger(UserValidationValidator.class);

  @Override
  public boolean isValid(User domain, ConstraintValidatorContext context) {

    // address max 3
    if (domain.getAddresses().size() > 3) {
      //throw new DomainValidationException(String.format("user addresses must be less than or equal to 3."));
      context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("{order.address.max3}")
            .addConstraintViolation();
      return false;
    }

    // phones max 3
    if (domain.getPhones().size() > 3) {
      //throw new DomainValidationException(String.format("user phones must be less than or equal to 3."));
      context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("{order.phone.max3}")
            .addConstraintViolation();
      return false;
    }

    // if pass all of them,
    return true;
  }
}

