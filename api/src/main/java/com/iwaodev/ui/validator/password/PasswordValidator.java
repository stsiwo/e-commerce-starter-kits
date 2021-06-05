package com.iwaodev.ui.validator.password;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

class PasswordValidator implements ConstraintValidator<Password, String> {

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {

    /**
     * password is optional.
     *
     * if password is null/empty, pass the validation, but it will not be updated (e.g., just ignored) since password will never be empty.
     *
     * otherwise (if password has a value), we need to validate whether it match its validation.
     *
     **/

    if (value == null || value == "") {
      return true;
    }

    // custom password logic here with PCI compliance.
    

    // if pass all of them,
    return true;
  }
}

