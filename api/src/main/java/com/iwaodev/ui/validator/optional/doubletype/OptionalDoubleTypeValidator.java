package com.iwaodev.ui.validator.optional.doubletype;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class OptionalDoubleTypeValidator implements ConstraintValidator<OptionalDoubleType, Double> {

  @Override
  public boolean isValid(Double value, ConstraintValidatorContext context) {

    /**
     * optional doubletype 
     *
     * if this is null/empty, pass the validation.
     *
     * otherwise (if this has a value), we need to validate whether it match its
     * validation.
     *
     **/

    // optional
    if (value == null) {
      return true;
    }

    // if pass all of them,
    return true;
  }
}

