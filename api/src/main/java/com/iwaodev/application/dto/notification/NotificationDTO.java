package com.iwaodev.application.dto.notification;

import java.time.LocalDateTime;

import com.iwaodev.domain.notification.NotificationTypeEnum;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@ToString
public class NotificationDTO {

  private String notificationId;

  private String notificationTitle;
  private String notificationDescription;
  private UserDTO issuer;
  private UserDTO recipient;
  private Boolean isRead;
  private String link;
  private String note;
  private NotificationTypeEnum notificationType;
  private LocalDateTime createdAt;
  private LocalDateTime readAt;
}



