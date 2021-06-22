package com.iwaodev.ui.validator.optional.digit;

import java.math.BigDecimal;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;


public class OptionalDigitValidator implements ConstraintValidator<OptionalDigit, BigDecimal> {

  @Override
  public boolean isValid(BigDecimal value, ConstraintValidatorContext context) {

    /**
     * optional digit 
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

    // check if it greater than or equal $1
    if (value.compareTo(BigDecimal.valueOf(1.00)) < 0) {
      return false;
    }

    // if pass all of them,
    return true;
  }

@Override
public String toString() {
	return "PasswordValidator []";
}
}

