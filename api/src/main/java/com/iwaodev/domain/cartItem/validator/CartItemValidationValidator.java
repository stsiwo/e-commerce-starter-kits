package com.iwaodev.domain.cartItem.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.infrastructure.model.CartItem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * don't use this at any JPA class (e.g., Entity class, EntityListner).
 *
 **/
// if this is used by another package, don't forget to add 'public' otherwise, they cannot access.
@Component
public class CartItemValidationValidator implements ConstraintValidator<CartItemValidation, CartItem> {

  private static final Logger logger = LoggerFactory.getLogger(CartItemValidationValidator.class);

  @Override
  public boolean isValid(CartItem domain, ConstraintValidatorContext context) {

    //// cartitems max 3
    //if (domain.getUser().getCartItemes().size() > 5) {
    //  //throw new DomainValidationException(String.format("cartitem cartitems must be less than or equal to 3."));
    //  context.disableDefaultConstraintViolation();
    //        context.buildConstraintViolationWithTemplate("{cartItem.size.max5}")
    //        .addConstraintViolation();
    //  return false;
    //}

    // if pass all of them,
    return true;
  }
}

