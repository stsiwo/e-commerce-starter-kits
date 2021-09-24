package com.iwaodev.infrastructure.model;

import javax.persistence.*;

import com.iwaodev.domain.notification.NotificationTypeEnum;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.sql.Timestamp;

@Data
@ToString
@NoArgsConstructor
@Entity(name = "notificationTypes")
public class NotificationType {

  @Id
  @Column(name = "notification_type_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long notificationTypeId;

  @Enumerated(EnumType.STRING)
  @Column(name = "notification_type")
  private NotificationTypeEnum notificationType;

  @Column(name="notification_title_template")
  private String notificationTitleTemplate;

  @Version
  @Column(name = "version")
  private Long version = 0L;

  @ManyToOne
  @JoinColumn(name = "issuer_type_id", insertable = true, updatable = true)
  private UserType issuerType;

  @ManyToOne
  @JoinColumn(name = "recipient_type_id", insertable = true, updatable = true)
  private UserType recipientType;

}




