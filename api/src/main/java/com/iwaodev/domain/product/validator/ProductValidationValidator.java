package com.iwaodev.domain.product.validator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.infrastructure.model.Product;
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
public class ProductValidationValidator implements ConstraintValidator<ProductValidation, Product> {

  private static final Logger logger = LoggerFactory.getLogger(ProductValidationValidator.class);

  @Override
  public boolean isValid(Product domain, ConstraintValidatorContext context) {

    /**
     * bug?
     *
     * getProductIMages().size() already return 0.
     *
     * even if it returns proper number (e.g., 5) at ProductServiceIMpl.
     *
     * for now just disable and create ProductImageValidator instread.
     *
     * but need to fix this otherwise, we cannot check the primary image size > 0.
     **/

    // productImages: primary image cannot be null.
    for (ProductImage productImage : domain.getProductImages()) {
      // this is primary image
      if (productImage.getProductImageName().contains("0")) {
        if (productImage.getProductImagePath().isEmpty()) {
          // throw new DomainValidationException(String.format("product primary image
          // cannot be null."));
          // chage default message to this message to set different message inside this
          // function.
          context.disableDefaultConstraintViolation();
          context.buildConstraintViolationWithTemplate("{product.productImages.primarynotnull}").addConstraintViolation();
        }
      }
    }

    // if public: true only if the product has variant at least one and release date
    // passed.
    // category
    if (domain.getIsPublic()) {
      if (domain.getVariants().size() == 0 && domain.getReleaseDate().isBefore(LocalDateTime.now())) {
        //throw new DomainValidationException(String
        //    .format("product need to have at least one variant and must be after the release date to be publish."));
          // cannot be null."));
          // chage default message to this message to set different message inside this
          // function.
          context.disableDefaultConstraintViolation();
          context.buildConstraintViolationWithTemplate("{product.isPublic.onevariantandafterreleasedate}").addConstraintViolation();
      }
    }

    // if isDiscount = true
    if (domain.getIsDiscount()) {

      // base discount price
      if (domain.getProductBaseDiscountPrice() == null) {
        //throw new DomainValidationException(
        //    String.format("base discount price can not be null if you are enable discount."));
          // chage default message to this message to set different message inside this
          // function.
          context.disableDefaultConstraintViolation();
          context.buildConstraintViolationWithTemplate("{product.baseDiscountPrice.notnull}").addConstraintViolation();
      }

      if (domain.getProductBaseDiscountPrice().compareTo(new BigDecimal("1")) < 0) {
        //throw new DomainValidationException(
            //String.format("base discount unit price must be greater than or equal 1. (the current discount price: %s)",
                //domain.getProductBaseDiscountPrice()));
          // chage default message to this message to set different message inside this
          // function.
          context.disableDefaultConstraintViolation();
          context.buildConstraintViolationWithTemplate("{product.baseDiscountPrice.min1}").addConstraintViolation();
      }

      // base discount date
      if (domain.getProductBaseDiscountStartDate() == null) {
        //throw new DomainValidationException(
            //String.format("base discount start date can not be null if you are enable discount."));
          // chage default message to this message to set different message inside this
          // function.
          context.disableDefaultConstraintViolation();
          context.buildConstraintViolationWithTemplate("{product.baseDiscountStartDate.notnull}").addConstraintViolation();
      }

      // base discount date
      if (domain.getProductBaseDiscountEndDate() == null) {
        //throw new DomainValidationException(
          //  String.format("base discount end date can not be null if you are enable discount."));
          // chage default message to this message to set different message inside this
          // function.
          context.disableDefaultConstraintViolation();
          context.buildConstraintViolationWithTemplate("{product.baseDiscountEndDate.notnull}").addConstraintViolation();
      }

      // base discount date: start < end
      if (domain.getProductBaseDiscountEndDate().isBefore(domain.getProductBaseDiscountStartDate())) {
        //throw new DomainValidationException(String.format("base discount start date must be before the end date."));
          context.disableDefaultConstraintViolation();
          context.buildConstraintViolationWithTemplate("{product.discountDate.startbeforeend}").addConstraintViolation();
      }
    }
    // if pass all of them,
    return true;
  }
}
