package com.iwaodev.domain.notification.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.application.irepository.CartItemRepository;
import com.iwaodev.application.irepository.CategoryRepository;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.CartItem;
import com.iwaodev.infrastructure.model.Notification;

import org.hibernate.validator.constraintvalidation.HibernateConstraintValidatorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * don't use this at any JPA class (e.g., Entity class, EntityListner).
 *
 **/
// if this is used by another package, don't forget to add 'public' otherwise,
// they cannot access.
@Component
public class IssuerValidationValidator implements ConstraintValidator<IssuerValidation, Notification> {

  private static final Logger logger = LoggerFactory.getLogger(IssuerValidationValidator.class);

  @Override
  public boolean isValid(Notification domain, ConstraintValidatorContext context) {

    // issuer - not null if issuer is admin/member
    NotificationTypeEnum actualNotificationType = domain.getNotificationType().getNotificationType();

    if (domain.isGuestIssuerByTypeOf(actualNotificationType) && domain.getIssuer() != null) {
      // throw new DomainValidationException(String.format("issuer must be null.
      // (type: %s)", actualNotificationType));

      // https://stackoverflow.com/questions/23702975/building-dynamic-constraintviolation-error-messages
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.disableDefaultConstraintViolation();
      hibernateConstraintValidatorContext.addMessageParameter("0", actualNotificationType)
          .buildConstraintViolationWithTemplate("{notification.issuer.null}").addConstraintViolation();
      return false;

    }

    if (!domain.isGuestIssuerByTypeOf(actualNotificationType) && domain.getIssuer() == null) {
      // throw new DomainValidationException(String.format("issuer cannot be null.
      // (type: %s)", actualNotificationType));

      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.disableDefaultConstraintViolation();
      hibernateConstraintValidatorContext.addMessageParameter("0", actualNotificationType)
          .buildConstraintViolationWithTemplate("{notification.issuer.notnull}").addConstraintViolation();
      return false;
    }


    // if issuer exist
    if (domain.getIssuer() != null) {
      // issuer - match with issuer type
      UserTypeEnum expectedIssuerType = domain.getNotificationType().getIssuerType().getUserType();
      UserTypeEnum actualIssuerType = domain.getIssuer().getUserType().getUserType();
      if (!actualIssuerType.equals(expectedIssuerType)) {
        // throw new DomainValidationException(
        // String.format("the issuer must be %s for the notification (your type: %s and
        // notification type; %s)",
        // expectedIssuerType, actualIssuerType, actualNotificationType));

        // https://stackoverflow.com/questions/23702975/building-dynamic-constraintviolation-error-messages
        HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
            .unwrap(HibernateConstraintValidatorContext.class);

        hibernateConstraintValidatorContext.disableDefaultConstraintViolation();
        hibernateConstraintValidatorContext.addMessageParameter("0", expectedIssuerType)
            .addMessageParameter("1", actualIssuerType).addMessageParameter("2", actualNotificationType)
            .buildConstraintViolationWithTemplate("{notification.issuer.invalidtype}").addConstraintViolation();

        return false;
      }
    }

    // if pass all of them,
    return true;
  }
}
