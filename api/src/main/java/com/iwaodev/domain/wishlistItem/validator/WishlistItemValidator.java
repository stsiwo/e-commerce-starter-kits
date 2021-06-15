package com.iwaodev.domain.wishlistItem.validator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.WishlistItem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class WishlistItemValidator implements Validator<WishlistItem> {

  private static final Logger logger = LoggerFactory.getLogger(WishlistItemValidator.class);

  /**
   * make sure this works.
   **/
  @Autowired
  private CurAuthentication curAuthentication;

  @Override
  public boolean validateWhenBoth(WishlistItem domain) throws DomainValidationException {

    logger.info("start WishlistItemValidator");

    // user
    if (domain.getUser() == null) {
      throw new DomainValidationException(String.format("user can not be null."));
    }

    // variant
    if (domain.getVariant() == null) {
      throw new DomainValidationException(String.format("variant can not be null."));
    }

    return true;
  }

  @Override
  public boolean validateWhenCreate(WishlistItem domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(WishlistItem domain) throws DomainValidationException {
    return true;
  }
}
