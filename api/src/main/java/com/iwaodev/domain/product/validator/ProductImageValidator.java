package com.iwaodev.domain.product.validator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.ProductImage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ProductImageValidator implements Validator<ProductImage> {

  private static final Logger logger = LoggerFactory.getLogger(ProductImageValidator.class);

  /**
   * make sure this works.
   **/
  @Autowired
  private CurAuthentication curAuthentication;

  @Override
  public boolean validateWhenBoth(ProductImage domain) throws DomainValidationException {

    logger.info("start ProductImageValidator");

    /**
     * primary image (e.g., product-image-0-xxxx.xxx) cannot be null
     **/
    if (domain.getProductImageName().contains("0")) {
      if (domain.getProductImagePath().isEmpty()) {
        throw new DomainValidationException(String.format("product primary image cannot be null."));
      }
    }

    return true;
  }

  @Override
  public boolean validateWhenCreate(ProductImage domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(ProductImage domain) throws DomainValidationException {
    return true;
  }
}
