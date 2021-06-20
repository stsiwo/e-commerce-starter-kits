package com.iwaodev.domain.category.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.application.irepository.CategoryRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

// if this is used by another package, don't forget to add 'public' otherwise, they cannot access.
@Component
public class CategoryNameUniqueValidator implements ConstraintValidator<CategoryNameUnique, String> {

  private static final Logger logger = LoggerFactory.getLogger(CategoryNameUniqueValidator.class);

  @Autowired
  private CategoryRepository categoryRepository;

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {

    if (this.categoryRepository.findByCategoryName(value).isPresent()) {
      return false;
    }

    // if pass all of them,
    return true;
  }
}
