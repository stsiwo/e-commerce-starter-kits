package com.iwaodev.domain.order.validator;

import java.math.BigDecimal;
import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.OrderDetail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class OrderDetailValidator implements Validator<OrderDetail> {

  private static final Logger logger = LoggerFactory.getLogger(OrderDetailValidator.class);

  @Override
  public boolean validateWhenBoth(OrderDetail domain) throws DomainValidationException {

    logger.info("start OrderDetailValidator");

    // product quantity
    if (domain.getProductQuantity() == null) {
      throw new DomainValidationException(String.format("quantity can not be null."));
    }

    if (domain.getProductQuantity() <= 0) {
      throw new DomainValidationException(String.format(
          "the quantity must be greater than or equal to 1. (the current quantity: %s).", domain.getProductQuantity()));
    }

    // product unit price
    if (domain.getProductUnitPrice() == null) {
      throw new DomainValidationException(String.format("unit price can not be null."));
    }

    // product unit price
    if (domain.getProductUnitPrice().compareTo(new BigDecimal("1")) < 0) {
      throw new DomainValidationException(String
          .format("unit price must be greater than or equal 1. (the current price: %s)", domain.getProductUnitPrice()));
    }

    // product color
    if (domain.getProductColor() == null || domain.getProductColor().isEmpty()) {
      throw new DomainValidationException(String.format("color can not be null."));
    }

    // product size
    if (domain.getProductSize() == null) {
      throw new DomainValidationException(String.format("size can not be null."));
    }

    // product name
    if (domain.getProductName() == null || domain.getProductName().isEmpty()) {
      throw new DomainValidationException(String.format("name can not be null."));
    }

    // order
    if (domain.getOrder() == null) {
      throw new DomainValidationException(String.format("order can not be null."));
    }

    //
    // TODO: create separate function for @PrePersist and @PreUpdate

    // order
    if (domain.getOrder() == null) {
      throw new DomainValidationException(String.format("order can not be null."));
    }

    return true;
  }

  @Override
  public boolean validateWhenCreate(OrderDetail domain) throws DomainValidationException {

    // variant & product
    // this can be null if the variant and product is deleted.
    // but when creating, it can not be null.
    
    // product
    if (domain.getProduct() == null) {
      throw new DomainValidationException(String.format("product can not be null."));
    }

    // product variant
    if (domain.getProductVariant() == null) {
      throw new DomainValidationException(String.format("product variant can not be null."));
    }

    return true;
  }

  @Override
  public boolean validateWhenUpdate(OrderDetail domain) throws DomainValidationException {
    // variant & product
    // this can be null if the variant and product is deleted.
    // but when creating, it can not be null.
    return true;
  }
}
