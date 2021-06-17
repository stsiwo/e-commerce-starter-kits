package com.iwaodev.domain.cartItem.validator;

import java.util.UUID;

import com.iwaodev.application.irepository.CartItemRepository;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.CartItem;

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
public class CartItemValidator implements Validator<CartItem> {

  private static final Logger logger = LoggerFactory.getLogger(CartItemValidator.class);

  @Autowired
  private CartItemRepository cartItemRepository;

  @Override
  public boolean validateWhenBoth(CartItem domain) throws DomainValidationException {

    logger.info("start CartItemNotNullValidator");

    if (domain.getUser() == null) {
      throw new DomainValidationException(String.format("user can not be null for this cart item"));
    }

    if (domain.getVariant() == null) {
      throw new DomainValidationException(String.format("variant can not be null for this cart item"));
    }

    if (domain.getIsSelected() == null) {
      throw new DomainValidationException(String.format("the selection can not be null for this cart item"));
    }

    if (domain.getQuantity() == null) {
      throw new DomainValidationException(String.format("the quantity can not be null for this cart item"));
    }

    if (domain.getQuantity() <= 0) {
      throw new DomainValidationException(String
          .format("the quantity must be greater than or equal to 1. (the current quantity: %s)", domain.getQuantity()));
    }

    return true;
  }

  @Override
  public boolean validateWhenCreate(CartItem domain) throws DomainValidationException {

    UUID userId = domain.getUser().getUserId();
    if (this.cartItemRepository.getAllByUserId(userId).size() > 4) {
      throw new DomainValidationException(String.format("exceed the max cart items size."));
    }

    return true;
  }

  @Override
  public boolean validateWhenUpdate(CartItem domain) throws DomainValidationException {

    if (domain.getCartItemId() == null) {
      throw new DomainValidationException(String.format("cart item id cannot be null."));
    }

    return true;
  }
}
