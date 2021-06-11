package com.iwaodev.application.irepository;

import java.util.Map;

import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.infrastructure.model.NotificationType;

public interface AdvanceNotificationRepository {

  public Map<NotificationTypeEnum, NotificationType> getListOfNotificationTypes();
}
