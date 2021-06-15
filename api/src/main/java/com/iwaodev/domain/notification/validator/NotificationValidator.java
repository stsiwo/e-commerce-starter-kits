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
public class NotificationValidator implements Validator<Notification> {

  private static final Logger logger = LoggerFactory.getLogger(NotificationValidator.class);

  @Override
  public boolean validateWhenBoth(Notification domain) throws DomainValidationException {

    logger.info("start IssuerAndRecipientTypeMustMatchWithNotificationType");

    // title
    if (domain.getNotificationTitle() == null) {
      throw new DomainValidationException(String.format("notification title cannot be null."));
    }

    // desc
    if (domain.getNotificationDescription() == null) {
      throw new DomainValidationException(String.format("notification description cannot be null."));
    }

    // type
    if (domain.getNotificationType() == null) {
      throw new DomainValidationException(String.format("notification type cannot be null."));
    }

    // issuer - not null if issuer is admin/member
    NotificationTypeEnum actualNotificationType = domain.getNotificationType().getNotificationType();

    UserTypeEnum expectedIssuerType = domain.getNotificationType().getIssuerType().getUserType();
    if (!expectedIssuerType.equals(UserTypeEnum.GUEST) && domain.getIssuer() == null) {
      throw new DomainValidationException(String.format("issuer cannot be null."));
    }

    // issuer - null if issuer is guest
    if (expectedIssuerType.equals(UserTypeEnum.GUEST) && domain.getIssuer() != null) {
      throw new DomainValidationException(String.format("issuer should be null because of it is guest."));
    }

    // issuer - match with issuer type
    UserTypeEnum actualIssuerType = domain.getIssuer().getUserType().getUserType();
    if (!actualIssuerType.equals(expectedIssuerType)) {
      throw new DomainValidationException(
          String.format("the issuer must be %s for the notification (your type: %s and notification type; %s)",
              expectedIssuerType, actualIssuerType, actualNotificationType));
    }

    // recipient - not null
    if (domain.getRecipient() == null) {
      throw new DomainValidationException(String.format("recipient cannot be null."));
    }

    // recipient - match with recipient type
    UserTypeEnum expectedRecipientType = domain.getNotificationType().getRecipientType().getUserType();
    UserTypeEnum actualRecipientType = domain.getRecipient().getUserType().getUserType();
    if (!actualRecipientType.equals(expectedRecipientType)) {
      throw new DomainValidationException(
          String.format("the recipient must be %s for the notification (your type: %s and notification type; %s)",
              expectedRecipientType, actualRecipientType, actualNotificationType));
    }

    // isRead
    if (domain.getIsRead() == null) {
      throw new DomainValidationException(String.format("isRead cannot be null."));
    }

    return true;
  }

  @Override
  public boolean validateWhenCreate(Notification domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(Notification domain) throws DomainValidationException {
    return true;
  }
}
