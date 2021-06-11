package com.iwaodev.infrastructure.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.iwaodev.domain.notification.NotificationTypeEnum;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

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

  @ManyToOne
  @JoinColumn(name = "issuer_type_id", insertable = true, updatable = true)
  private UserType issuer;

  @ManyToOne
  @JoinColumn(name = "recipient_type_id", insertable = true, updatable = true)
  private UserType recipient;

}




