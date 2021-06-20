package com.iwaodev.domain.product.validator;

import java.util.UUID;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.infrastructure.model.ProductVariant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

// if this is used by another package, don't forget to add 'public' otherwise, they cannot access.
@Component
public class VariantColorAndSizeUniqueValidator implements ConstraintValidator<VariantColorAndSizeUnique, ProductVariant> {

  private static final Logger logger = LoggerFactory.getLogger(VariantColorAndSizeUniqueValidator.class);

  @Autowired
  private ProductRepository productRepository;

  @Override
  public boolean isValid(ProductVariant domain, ConstraintValidatorContext context) {

    // unique
    UUID productId = domain.getProduct().getProductId();
    logger.info("where is bug");
    if (this.productRepository
        .findVariantByColorAndSize(productId, domain.getVariantColor(), domain.getProductSize().getProductSizeName())
        .isPresent()) {
      //throw new DomainValidationException(String.format("duplicated color and size combination not allowed."));
      return false;
    }
    // if pass all of them,
    return true;
  }
}
