package com.iwaodev.domain.user.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.infrastructure.model.Address;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * don't use this at any JPA class (e.g., Entity class, EntityListner).
 *
 **/
// if this is used by another package, don't forget to add 'public' otherwise, they cannot access.
@Component
public class AddressValidationValidator implements ConstraintValidator<AddressValidation, Address> {

  private static final Logger logger = LoggerFactory.getLogger(AddressValidationValidator.class);

  @Override
  public boolean isValid(Address domain, ConstraintValidatorContext context) {

    // addresss max 3
    if (domain.getUser().getAddresses().size() > 3) {
      //throw new DomainValidationException(String.format("address addresss must be less than or equal to 3."));
      context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("{order.address.max3}")
            .addConstraintViolation();
      return false;
    }

    // if pass all of them,
    return true;
  }
}

