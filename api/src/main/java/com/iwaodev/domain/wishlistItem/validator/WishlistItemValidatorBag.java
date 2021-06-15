package com.iwaodev.domain.wishlistItem.validator;

import java.util.List;

import com.iwaodev.domain.validator.Validator;
import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.WishlistItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class WishlistItemValidatorBag implements ValidatorBag<WishlistItem> {

  @Autowired
  private List<Validator<WishlistItem>> validators;

	@Override
	public boolean validateAll(WishlistItem domain, String when) throws DomainValidationException {

    boolean result = false;

    for (Validator<WishlistItem> validator : this.validators) {
      result = validator.validateWhenBoth(domain);

      // run only if @PrePersist
      if (when.equals("create")) {
        result = validator.validateWhenCreate(domain);
      }
      // run only if @PreUpdate
      if (when.equals("update")) {
        result = validator.validateWhenUpdate(domain);
      }
    }

    return result;
	}
}

