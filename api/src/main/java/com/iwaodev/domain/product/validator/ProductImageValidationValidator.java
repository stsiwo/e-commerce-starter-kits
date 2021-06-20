package com.iwaodev.domain.product.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.infrastructure.model.ProductImage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * don't use this at any JPA class (e.g., Entity class, EntityListner).
 *
 **/
// if this is used by another package, don't forget to add 'public' otherwise,
// they cannot access.
@Component
public class ProductImageValidationValidator implements ConstraintValidator<ProductImageValidation, ProductImage> {

  private static final Logger logger = LoggerFactory.getLogger(ProductImageValidationValidator.class);

  @Override
  public boolean isValid(ProductImage domain, ConstraintValidatorContext context) {

    /**
     * primary image (e.g., product-image-0-xxxx.xxx) cannot be null
     **/
    if (domain.getProductImageName().contains("0")) {
      if (domain.getProductImagePath().isEmpty()) {
        //throw new DomainValidationException(String.format("product primary image cannot be null."));
        context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("{productImage.primary.notnull}")
            .addConstraintViolation();
      }
    }
    // if pass all of them,
    return true;
  }
}
