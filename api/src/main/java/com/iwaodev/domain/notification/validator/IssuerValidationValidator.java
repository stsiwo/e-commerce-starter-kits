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

    logger.info("start validating issuer.");
    logger.info("notificaiton type: " + actualNotificationType.toString());

    if (domain.isGuestIssuerByTypeOf(actualNotificationType) && domain.getIssuer() != null) {
      // throw new DomainValidationException(String.format("issuer must be null.
      // (type: %s)", actualNotificationType));

      logger.info("{notification.issuer.null}");
      // chage default message to this message to set different message inside this
      // function.
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("{notification.issuer.null}").addConstraintViolation();

      // you need to unwrap to set parameter to the message.
      // ref:
      // https://stackoverflow.com/questions/45510986/is-it-possible-to-add-message-parameter-for-constraint-violation-template-messag/45511264
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.addMessageParameter("0", actualNotificationType);
      return false;

    }

    if (!domain.isGuestIssuerByTypeOf(actualNotificationType) && domain.getIssuer() == null) {
      // throw new DomainValidationException(String.format("issuer cannot be null.
      // (type: %s)", actualNotificationType));

      logger.info("{notification.issuer.notnull}");
      // chage default message to this message to set different message inside this
      // function.
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("{notification.issuer.notnull}").addConstraintViolation();

      // you need to unwrap to set parameter to the message.
      // ref:
      // https://stackoverflow.com/questions/45510986/is-it-possible-to-add-message-parameter-for-constraint-violation-template-messag/45511264
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.addMessageParameter("0", actualNotificationType);
      return false;
    }

    logger.info("where is my bug?");

    // if issuer exist
    if (domain.getIssuer() != null) {
      // issuer - match with issuer type
      UserTypeEnum expectedIssuerType = domain.getNotificationType().getIssuerType().getUserType();
      UserTypeEnum actualIssuerType = domain.getIssuer().getUserType().getUserType();
      if (!actualIssuerType.equals(expectedIssuerType)) {
        //throw new DomainValidationException(
        //    String.format("the issuer must be %s for the notification (your type: %s and notification type; %s)",
        //        expectedIssuerType, actualIssuerType, actualNotificationType));
        
        logger.info("{notification.issuer.invalidtype}");
        // chage default message to this message to set different message inside this
        // function.
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate("{notification.issuer.invalidtype}").addConstraintViolation();

        // you need to unwrap to set parameter to the message.
        // ref:
        // https://stackoverflow.com/questions/45510986/is-it-possible-to-add-message-parameter-for-constraint-violation-template-messag/45511264
        HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
            .unwrap(HibernateConstraintValidatorContext.class);
        hibernateConstraintValidatorContext.addMessageParameter("{0}", expectedIssuerType);
        hibernateConstraintValidatorContext.addMessageParameter("{1}", actualIssuerType);
        hibernateConstraintValidatorContext.addMessageParameter("{2}", actualNotificationType);
        return false;
      }
    }

    // if pass all of them,
    return true;
  }
}
