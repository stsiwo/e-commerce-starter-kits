package com.iwaodev.domain.cartItem.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.application.irepository.CartItemRepository;
import com.iwaodev.application.irepository.CategoryRepository;
import com.iwaodev.domain.category.validator.CategoryPathUnique;
import com.iwaodev.infrastructure.model.CartItem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * don't use this at any JPA class (e.g., Entity class, EntityListner).
 *
 **/
// if this is used by another package, don't forget to add 'public' otherwise, they cannot access.
@Component
public class UserAndVariantMustBeUniqueValidator implements ConstraintValidator<UserAndVariantMustBeUnique, CartItem> {

  private static final Logger logger = LoggerFactory.getLogger(UserAndVariantMustBeUniqueValidator.class);

  @Autowired
  private CartItemRepository cartItemRepository;

  @Override
  public boolean isValid(CartItem domain, ConstraintValidatorContext context) {

    if (this.cartItemRepository.findByVariantIdAndUserId(domain.getVariantId(), domain.getUserId()).isPresent()) {
      return false;
    }

    // if pass all of them,
    return true;
  }
}

