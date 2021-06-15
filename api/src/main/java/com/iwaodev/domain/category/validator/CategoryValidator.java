package com.iwaodev.domain.category.validator;

import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Category;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * validate this domain.
 *
 * check the spec at 'note.md' at domain directory.
 *
 **/
@Component
public class CategoryValidator implements Validator<Category> {

  private static final Logger logger = LoggerFactory.getLogger(CategoryValidator.class);

  @Override
  public boolean validateWhenBoth(Category domain) throws DomainValidationException {

    logger.info("start CategoryNotNullValidator");

    if (domain.getCategoryName() == null) {
      throw new DomainValidationException(String.format("category name can not be null."));
    }

    // unique validation is at app service class.

    if (domain.getCategoryDescription() == null) {
      throw new DomainValidationException(String.format("category description can not be null."));
    }

    if (domain.getCategoryPath() == null) {
      throw new DomainValidationException(String.format("category path can not be null."));
    }

    // unique validation is at app service class.

    return true;
  }

  @Override
  public boolean validateWhenCreate(Category domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(Category domain) throws DomainValidationException {
    return true;
  }
}
