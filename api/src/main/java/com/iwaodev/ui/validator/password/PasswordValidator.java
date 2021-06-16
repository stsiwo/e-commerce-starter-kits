package com.iwaodev.ui.validator.password;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class PasswordValidator implements ConstraintValidator<Password, String> {

  private static final Logger logger = LoggerFactory.getLogger(PasswordValidator.class);

  private boolean optional;

  public void initialize(Password constraintAnnotation) {
    this.optional = constraintAnnotation.optional();
  }

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {

    /**
     * password is optional.
     *
     * use context.optional
     *
     * if password is null/empty, pass the validation, but it will not be updated
     * (e.g., just ignored) since password will never be empty.
     *
     * otherwise (if password has a value), we need to validate whether it match its
     * validation.
     *
     **/

    // optional if optional = true
    if (value == null || value == "") {
      return this.optional ? true : false;
    }

    // custom password logic here with PCI compliance.
    /**
     * this might be null if the user does not want to update password (e.g.,
     * optional).
     *
     * password policy: - at least 8 chars - must include lower/upper case - no
     * space (leading/trailing/middle)
     * 
     **/
    if (value.length() < 8) {
      return false;
    }

    if (value.equals(value.toLowerCase()) || value.equals(value.toUpperCase())) {
      return false;
    }

    if (value.contains(" ")) {
      return false;
    }

    // if pass all of them,
    return true;
  }
}
