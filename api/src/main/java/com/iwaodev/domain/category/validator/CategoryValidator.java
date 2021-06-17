package com.iwaodev.domain.category.validator;

import com.iwaodev.application.irepository.CategoryRepository;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Category;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

  @Autowired
  private CategoryRepository categoryRepository;

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

    // unique name
    if (this.categoryRepository.findByCategoryName(domain.getCategoryName()).isPresent()) {
      throw new DomainValidationException(
          String.format("category name must be unique (name: %s).", domain.getCategoryName()));
    }

    // unique path
    if (this.categoryRepository.findByCategoryPath(domain.getCategoryPath()).isPresent()) {
      throw new DomainValidationException(
          String.format("category path must be unique (path: %s).", domain.getCategoryPath()));
    }

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
