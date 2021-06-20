package com.iwaodev.domain.product.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.application.irepository.ProductRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

// if this is used by another package, don't forget to add 'public' otherwise, they cannot access.
// //
@Component
public class ProductPathUniqueValidator implements ConstraintValidator<ProductPathUnique, String> {

  private static final Logger logger = LoggerFactory.getLogger(ProductPathUniqueValidator.class);

  @Autowired
  private ProductRepository productRepository;

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {

    if (this.productRepository.findByPathOrId(value).isPresent()) {
      return false;
    }

    // if pass all of them,
    return true;
  }
}
