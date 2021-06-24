package com.iwaodev.domain.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.notification.validator.IssuerValidationValidator;
import com.iwaodev.domain.notification.validator.RecipientValidationValidator;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.NotificationType;
import com.iwaodev.infrastructure.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.iwaodev.exception.AppException;

@Service
public class CreateNotificationServiceImpl implements CreateNotificationService {

  private static final Logger logger = LoggerFactory.getLogger(CreateNotificationServiceImpl.class);

  @Autowired
  private NotificationRepository notificationRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private Validator validator ;

  @Override
  public Notification create(NotificationTypeEnum notificationType, String description, UUID issuerId, UUID recipientId,
      String link, String note) throws NotFoundException {

    // get issuer reference
    User issuer = this.userRepository.findById(issuerId).orElseThrow(() -> new NotFoundException("issuer not found"));

    // get recipient reference
    User recipient = this.userRepository.findById(recipientId)
        .orElseThrow(() -> new NotFoundException("recipient not found"));

    return this.create(notificationType, description, issuer, recipient, link, note);

  }

  @Override
  public Notification create(NotificationTypeEnum notificationType, String description, User issuer, User recipient,
      String link, String note) throws NotFoundException {
    // create notification
    Notification notification = new Notification();

    // get list of notifcationTypes
    Map<NotificationTypeEnum, NotificationType> notificationTypeList = this.notificationRepository
        .getListOfNotificationTypes();

    // find target notification type entity
    NotificationType notificationTypeEntity = Optional.ofNullable(notificationTypeList.get(notificationType))
        .orElseThrow(() -> new NotFoundException("target notification type not found"));

    // assign necessary input to notification
    notification.setNotificationType(notificationTypeEntity);
    notification.setNotificationTitle(notificationTypeEntity.getNotificationTitleTemplate());
    notification.setNotificationDescription(description);
    notification.setIssuer(issuer);
    notification.setRecipient(recipient);
    notification.setIsRead(false);
    notification.setLink(link);
    notification.setNote(note);

    //Set<ConstraintViolation<Notification>> constraintViolations = this.validator.validate(notification);

    //if (constraintViolations.size() > 0) {
    //  throw new AppException(HttpStatus.BAD_REQUEST, constraintViolations.iterator().next().getMessage());
    //}

    return notification;
  }

  @Override
  public List<Notification> createBatch(NotificationTypeEnum notificationType, String description, UUID issuerId,
      UserTypeEnum recipientType, String link, String note) throws NotFoundException {

    // crete a list
    List<Notification> notificationList = new ArrayList<>();

    // get all user of the given user type
    List<User> recipientList = this.userRepository.findAvailableAllByType(recipientType);

    logger.info("number of available user: " + recipientList.size());

    // get issuer reference
    User issuer = this.userRepository.findById(issuerId).orElseThrow(() -> new NotFoundException("issuer not found"));

    for (User recipient : recipientList) {
      notificationList.add(this.create(notificationType, description, issuer, recipient, link, note));
    }

    return notificationList;
  }

  @Override
  public List<Notification> createBatch(NotificationTypeEnum notificationType, String description, User issuer,
      UserTypeEnum recipientType, String link, String note) throws NotFoundException {
    // crete a list
    List<Notification> notificationList = new ArrayList<>();

    // get all user of the given user type
    List<User> recipientList = this.userRepository.findAvailableAllByType(recipientType);

    logger.info("number of available user: " + recipientList.size());

    for (User recipient : recipientList) {
      notificationList.add(this.create(notificationType, description, issuer, recipient, link, note));
    }

    return notificationList;
  }
}
