package com.iwaodev.domain.product.validator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductImage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ProductValidator implements Validator<Product> {

  private static final Logger logger = LoggerFactory.getLogger(ProductValidator.class);

  /**
   * make sure this works.
   **/
  @Autowired
  private CurAuthentication curAuthentication;

  @Override
  public boolean validateWhenBoth(Product domain) throws DomainValidationException {

    logger.info("start ProductValidator");

    // name
    if (domain.getProductName() == null) {
      throw new DomainValidationException(String.format("product name cannot be null."));
    }

    // description
    if (domain.getProductDescription() == null) {
      throw new DomainValidationException(String.format("product description cannot be null."));
    }

    // path
    if (domain.getProductPath() == null) {
      throw new DomainValidationException(String.format("product path cannot be null."));
    }

    // baseUnitPrice
    if (domain.getProductBaseUnitPrice() == null) {
      throw new DomainValidationException(String.format("product base unit price cannot be null."));
    }

    // public
    if (domain.getIsPublic() == null) {
      throw new DomainValidationException(String.format("product public cannot be null."));
    }

    // category
    if (domain.getCategory() == null) {
      throw new DomainValidationException(String.format("product category cannot be null."));
    }

    // releaseDate
    if (domain.getReleaseDate() == null) {
      throw new DomainValidationException(String.format("product release date cannot be null."));
    }

    // productImages
    if (domain.getProductImages() == null || domain.getProductImages().size() == 0) {
      throw new DomainValidationException(String.format("product product images cannot be null."));
    }

    // productImages: primary image cannot be null.
    for (ProductImage productImage : domain.getProductImages()) {
      // this is primary image
      if (productImage.getProductImageName().contains("0")) {
        if (productImage.getProductImagePath().isEmpty()) {
          throw new DomainValidationException(String.format("product primary image cannot be null."));
        }
      }
    }

    // if public: true only if the product has variant at least one and release date
    // passed.
    // category
    if (domain.getIsPublic()) {
      if (domain.getVariants().size() == 0 && domain.getReleaseDate().isBefore(LocalDateTime.now())) {
        throw new DomainValidationException(String
            .format("product need to have at least one variant and must be after the release date to be publish."));
      }
    }

    // product unit price
    if (domain.getProductBaseUnitPrice().compareTo(new BigDecimal("1")) < 0) {
      throw new DomainValidationException(
          String.format("base unit price must be greater than or equal 1. (the current price: %s)",
              domain.getProductBaseUnitPrice()));
    }

    // if isDiscount = true
    if (domain.getIsDiscount()) {

      // base discount price
      if (domain.getProductBaseDiscountPrice() == null) {
        throw new DomainValidationException(
            String.format("base discount price can not be null if you are enable discount."));
      }

      if (domain.getProductBaseDiscountPrice().compareTo(new BigDecimal("1")) < 0) {
        throw new DomainValidationException(
            String.format("base discount unit price must be greater than or equal 1. (the current discount price: %s)",
                domain.getProductBaseDiscountPrice()));
      }

      // base discount date
      if (domain.getProductBaseDiscountStartDate() == null) {
        throw new DomainValidationException(
            String.format("base discount start date can not be null if you are enable discount."));
      }

      // base discount date
      if (domain.getProductBaseDiscountEndDate() == null) {
        throw new DomainValidationException(
            String.format("base discount end date can not be null if you are enable discount."));
      }

      // base discount date: start < end
      if (domain.getProductBaseDiscountEndDate().isAfter(domain.getProductBaseDiscountStartDate())) {
        throw new DomainValidationException(String.format("base discount start date must be before the end date."));
      }
    }

    return true;
  }

  @Override
  public boolean validateWhenCreate(Product domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(Product domain) throws DomainValidationException {
    return true;
  }
}
