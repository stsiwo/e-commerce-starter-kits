package com.iwaodev.domain.user.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.infrastructure.model.Phone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * don't use this at any JPA class (e.g., Entity class, EntityListner).
 *
 **/
// if this is used by another package, don't forget to add 'public' otherwise, they cannot access.
@Component
public class PhoneValidationValidator implements ConstraintValidator<PhoneValidation, Phone> {

  private static final Logger logger = LoggerFactory.getLogger(PhoneValidationValidator.class);

  @Override
  public boolean isValid(Phone domain, ConstraintValidatorContext context) {

    logger.info("start validating custom phone ....");
    logger.info("size of phones: " + domain.getUser().getPhones().size());

    // phones max 3
    if (domain.getUser().getPhones().size() > 3) {
      //throw new DomainValidationException(String.format("phone phones must be less than or equal to 3."));
      context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("{order.phone.max3}")
            .addConstraintViolation();
      return false;
    }

    // if pass all of them,
    return true;
  }
}

