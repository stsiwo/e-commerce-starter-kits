package com.iwaodev.domain.service;

import java.util.List;
import java.util.UUID;

import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.User;

public interface CreateNotificationService {

  /**
   * use this when member issuer.
   *
   * if the user is not found, throw NotFoundException.
   **/
  public Notification create(NotificationTypeEnum notificationType, String description, UUID issuerId, UUID recipientId, String link, String note) throws NotFoundException;

  /**
   * use this when guest issuer.
   **/
  public Notification create(NotificationTypeEnum notificationType, String description, User issuer, User recipient, String link, String note) throws NotFoundException;

  /**
   * batch creation of notification for a given user type.
   *
   * - use INSERT INTO XX VALUES (row1), (row2), (row3) to avoid multiple sql execution.
   **/
  public List<Notification> createBatch(NotificationTypeEnum notificationType, String description, UUID issuerId, UserTypeEnum recipientType, String link, String note) throws NotFoundException;

  /**
   * batch creation of notification for a given user type.
   *
   * - use INSERT INTO XX VALUES (row1), (row2), (row3) to avoid multiple sql execution.
   **/
  public List<Notification> createBatch(NotificationTypeEnum notificationType, String description, User issuer, UserTypeEnum recipientType, String link, String note) throws NotFoundException;
}


