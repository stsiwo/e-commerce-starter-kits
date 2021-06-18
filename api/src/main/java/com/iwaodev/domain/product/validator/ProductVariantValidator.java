package com.iwaodev.domain.product.validator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.ProductVariant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ProductVariantValidator implements Validator<ProductVariant> {

  private static final Logger logger = LoggerFactory.getLogger(ProductVariantValidator.class);

  /**
   * make sure this works.
   **/
  @Autowired
  private CurAuthentication curAuthentication;

  //@Autowired
  //private ProductRepository productRepository;

  @Override
  public boolean validateWhenBoth(ProductVariant domain) throws DomainValidationException {

    logger.info("start ProductVariantValidator");

    // unit price: can be null
    // if (domain.getVariantUnitPrice() == null) {
    // throw new DomainValidationException(String.format("unit price cannot be
    // null."));
    // }

    // unit price
    if (domain.getVariantStock() == null) {
      throw new DomainValidationException(String.format("stock cannot be null."));
    }

    if (domain.getVariantStock() < 0) {
      throw new DomainValidationException(String.format("stock must be greater than or equal to 0."));
    }

    if (domain.getVariantColor() == null || domain.getVariantColor().isEmpty()) {
      throw new DomainValidationException(String.format("color cannot be null."));
    }

    if (domain.getProductSize() == null) {
      throw new DomainValidationException(String.format("size cannot be null."));
    }

    if (domain.getVariantWeight() == null) {
      throw new DomainValidationException(String.format("weight cannot be null."));
    }

    if (domain.getVariantWeight().compareTo(Double.valueOf("0.01")) < 0) {
      throw new DomainValidationException(String.format("weight must be greater than or equal to 0.01 kg"));
    }

    if (domain.getVariantLength() == null) {
      throw new DomainValidationException(String.format("length cannot be null."));
    }

    if (domain.getVariantLength().compareTo(Double.valueOf("1")) < 0) {
      throw new DomainValidationException(String.format("weight must be greater than or equal to 1 cm"));
    }

    if (domain.getVariantWidth() == null) {
      throw new DomainValidationException(String.format("width cannot be null."));
    }

    if (domain.getVariantWidth().compareTo(Double.valueOf("1")) < 0) {
      throw new DomainValidationException(String.format("width must be greater than or equal to 1 cm"));
    }

    if (domain.getVariantHeight() == null) {
      throw new DomainValidationException(String.format("height cannot be null."));
    }

    if (domain.getVariantHeight().compareTo(Double.valueOf("1")) < 0) {
      throw new DomainValidationException(String.format("height must be greater than or equal to 1 cm"));
    }

    // if isDiscount = true
    if (domain.getIsDiscount()) {

      // base discount price
      if (domain.getVariantDiscountPrice() == null) {
        throw new DomainValidationException(
            String.format("variant discount price can not be null if you are enable discount."));
      }

      if (domain.getVariantDiscountPrice().compareTo(new BigDecimal("1")) < 0) {
        throw new DomainValidationException(String.format(
            "variant discount unit price must be greater than or equal 1. (the current discount price: %s)",
            domain.getVariantDiscountPrice()));
      }

      // base discount date
      if (domain.getVariantDiscountStartDate() == null) {
        throw new DomainValidationException(
            String.format("variant discount start date can not be null if you are enable discount."));
      }

      // base discount date
      if (domain.getVariantDiscountEndDate() == null) {
        throw new DomainValidationException(
            String.format("variant discount end date can not be null if you are enable discount."));
      }

      // base discount date: start < end
      if (domain.getVariantDiscountEndDate().isBefore(domain.getVariantDiscountStartDate())) {
        throw new DomainValidationException(String.format("variant discount start date must be before the end date."));
      }
    }

    // unique
    //UUID productId = domain.getProduct().getProductId();
    //logger.info("where is bug");
    //if (this.productRepository
    //    .findVariantByColorAndSize(productId, domain.getVariantColor(), domain.getProductSize().getProductSizeName())
    //    .isPresent()) {
    //  throw new DomainValidationException(String.format("duplicated color and size combination not allowed."));
    //}

    return true;
  }

  @Override
  public boolean validateWhenCreate(ProductVariant domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(ProductVariant domain) throws DomainValidationException {
    logger.info("start validating product variant for update");
    return true;
  }
}
