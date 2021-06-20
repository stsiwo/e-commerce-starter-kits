package com.iwaodev.domain.user.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.application.irepository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

// if this is used by another package, don't forget to add 'public' otherwise, they cannot access.
@Component
public class UserEmailUniqueValidator implements ConstraintValidator<UserEmailUnique, String> {

  private static final Logger logger = LoggerFactory.getLogger(UserEmailUniqueValidator.class);

  @Autowired
  private UserRepository userRepository;

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {

    if (this.userRepository.findByEmail(value).isPresent()) {
      return false;
    }

    // if pass all of them,
    return true;
  }
}