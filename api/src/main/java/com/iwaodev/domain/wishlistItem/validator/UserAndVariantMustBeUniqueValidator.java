package com.iwaodev.domain.wishlistItem.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.application.irepository.WishlistItemRepository;
import com.iwaodev.application.irepository.CategoryRepository;
import com.iwaodev.domain.category.validator.CategoryPathUnique;
import com.iwaodev.infrastructure.model.WishlistItem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * don't use this at any JPA class (e.g., Entity class, EntityListner).
 *
 **/
// if this is used by another package, don't forget to add 'public' otherwise, they cannot access.
@Component(value = "wishlistItemUserAndVariantMustBeUniqueValidator")
public class UserAndVariantMustBeUniqueValidator implements ConstraintValidator<UserAndVariantMustBeUnique, WishlistItem> {

  private static final Logger logger = LoggerFactory.getLogger(UserAndVariantMustBeUniqueValidator.class);

  @Autowired
  private WishlistItemRepository wishlistItemRepository;

  @Override
  public boolean isValid(WishlistItem domain, ConstraintValidatorContext context) {

    if (this.wishlistItemRepository.findByVariantIdAndUserId(domain.getVariant().getVariantId(), domain.getUser().getUserId()).isPresent()) {
      return false;
    }

    // if pass all of them,
    return true;
  }
}

