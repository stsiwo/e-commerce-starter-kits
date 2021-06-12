package com.iwaodev.domain.notification.validator;

import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class IssuerAndRecipientTypeMustMatchWithNotificationType implements Validator<Notification> {

  private static final Logger logger = LoggerFactory
      .getLogger(IssuerAndRecipientTypeMustMatchWithNotificationType.class);

  @Override
  public boolean validate(Notification domain) throws DomainValidationException {

    logger.info("start IssuerAndRecipientTypeMustMatchWithNotificationType");

    NotificationTypeEnum actualNotificationType = domain.getNotificationType().getNotificationType();

    UserTypeEnum expectedIssuerType = domain.getNotificationType().getIssuerType().getUserType();
    UserTypeEnum actualIssuerType = domain.getIssuer().getUserType().getUserType();

    if (!actualIssuerType.equals(expectedIssuerType)) {
      throw new DomainValidationException(
          String.format("the issuer must be %s for the notification (your type: %s and notification type; %s)", expectedIssuerType, actualIssuerType, actualNotificationType)
          );
    }

    UserTypeEnum expectedRecipientType = domain.getNotificationType().getRecipientType().getUserType();
    UserTypeEnum actualRecipientType = domain.getRecipient().getUserType().getUserType();

    if (!actualRecipientType.equals(expectedRecipientType)) {
      throw new DomainValidationException(
          String.format("the recipient must be %s for the notification (your type: %s and notification type; %s)", expectedRecipientType, actualRecipientType, actualNotificationType)
          );
    }

    return true;
  }
}