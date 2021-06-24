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
public class RecipientValidationValidator implements ConstraintValidator<RecipientValidation, Notification> {

  private static final Logger logger = LoggerFactory.getLogger(RecipientValidationValidator.class);

  @Override
  public boolean isValid(Notification domain, ConstraintValidatorContext context) {

    // recipient - not null if recipient is admin/member
    NotificationTypeEnum actualNotificationType = domain.getNotificationType().getNotificationType();

    // recipient - not null
    if (domain.getRecipient() == null) {
      // throw new DomainValidationException(String.format("recipient cannot be
      // null."));

      // https://stackoverflow.com/questions/23702975/building-dynamic-constraintviolation-error-messages
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.disableDefaultConstraintViolation();
      hibernateConstraintValidatorContext.addMessageParameter("0", actualNotificationType)
          .buildConstraintViolationWithTemplate("{notification.recipient.notnull}").addConstraintViolation();

    }

    logger.info("where is my bug?");
    // recipient - match with recipient type
    UserTypeEnum expectedRecipientType = domain.getNotificationType().getRecipientType().getUserType();
    UserTypeEnum actualRecipientType = domain.getRecipient().getUserType().getUserType();
    if (!actualRecipientType.equals(expectedRecipientType)) {
      // throw new DomainValidationException(
      // String.format("the recipient must be %s for the notification (your type: %s
      // and notification type; %s)",
      // expectedRecipientType, actualRecipientType, actualNotificationType));

      // https://stackoverflow.com/questions/23702975/building-dynamic-constraintviolation-error-messages
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.disableDefaultConstraintViolation();
      hibernateConstraintValidatorContext.addMessageParameter("0", actualRecipientType)
          .addMessageParameter("1", expectedRecipientType).addMessageParameter("2", actualNotificationType)
          .buildConstraintViolationWithTemplate("{notification.recipient.invalidtype}").addConstraintViolation();
    }
    // if pass all of them,
    return true;
  }
}
