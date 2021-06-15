package com.iwaodev.domain.review.validator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Review;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ReviewValidator implements Validator<Review> {

  private static final Logger logger = LoggerFactory.getLogger(ReviewValidator.class);

  /**
   * make sure this works.
   **/
  @Autowired
  private CurAuthentication curAuthentication;

  @Override
  public boolean validateWhenBoth(Review domain) throws DomainValidationException {

    logger.info("start ReviewValidator");

    if (domain.getReviewPoint() == null) {
      throw new DomainValidationException(String.format("review point cannot be null."));
    }

    if (domain.getReviewPoint() < 0 || domain.getReviewPoint() > 5) {
      throw new DomainValidationException(String.format("review point must be in the range of 1 to 5."));
    }

    if (domain.getReviewTitle() == null) {
      throw new DomainValidationException(String.format("review title cannot be null."));
    }

    if (domain.getReviewDescription() == null) {
      throw new DomainValidationException(String.format("review description cannot be null."));
    }

    if (domain.getIsVerified() == null) {
      throw new DomainValidationException(String.format("review is verified boolean cannot be null."));
    }

    // only admin can make isVerified true
    List<UserTypeEnum> curAuthUserTypeList = this.curAuthentication.getRole();
    if (!curAuthUserTypeList.contains(UserTypeEnum.ADMIN) && domain.getIsVerified()) {
      throw new DomainValidationException(String.format("only admin can verify the review."));
    }
    return true;
  }

  @Override
  public boolean validateWhenCreate(Review domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(Review domain) throws DomainValidationException {
    return true;
  }
}
