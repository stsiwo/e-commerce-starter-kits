package com.iwaodev.domain.product.validator;

import java.math.BigDecimal;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.infrastructure.model.ProductVariant;

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
public class ProductVariantValidationValidator
    implements ConstraintValidator<ProductVariantValidation, ProductVariant> {

  private static final Logger logger = LoggerFactory.getLogger(ProductVariantValidationValidator.class);

  @Override
  public boolean isValid(ProductVariant domain, ConstraintValidatorContext context) {
    logger.info("start validating custom product variant logic...");

    logger.info("isDiscount: " + domain.getIsDiscount());

    // if isDiscount = true
    if (domain.getIsDiscount()) {

      // base discount price
      if (domain.getVariantDiscountPrice() == null) {
        // throw new DomainValidationException(
        // String.format("variant discount price can not be null if you are enable
        // discount."));
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate("{productVariant.discountPrice.notnull}").addConstraintViolation();
        return false;
      }

      if (domain.getVariantDiscountPrice().compareTo(new BigDecimal("1")) < 0) {
        // throw new DomainValidationException(String.format(
        // "variant discount unit price must be greater than or equal 1. (the current
        // discount price: %s)",
        // domain.getVariantDiscountPrice()));
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate("{productVariant.discountPrice.min1}").addConstraintViolation();
        return false;
      }

      // base discount date
      if (domain.getVariantDiscountStartDate() == null) {
        // throw new DomainValidationException(
        // String.format("variant discount start date can not be null if you are enable
        // discount."));
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate("{productVariant.discountStartDate.notnull}")
            .addConstraintViolation();
        return false;
      }

      // base discount date
      if (domain.getVariantDiscountEndDate() == null) {
        // throw new DomainValidationException(
        // String.format("variant discount end date can not be null if you are enable
        // discount."));
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate("{productVariant.discountEndDate.notnull}")
            .addConstraintViolation();
        return false;
      }

      // base discount date: start < end
      if (domain.getVariantDiscountStartDate().isBefore(domain.getVariantDiscountEndDate())) {
        // throw new DomainValidationException(String.format("variant discount start
        // date must be before the end date."));
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate("{productVariant.discountDate.startbeforeend}")
            .addConstraintViolation();
        return false;
      }
    }

    // if pass all of them,
    return true;
  }
}
