package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import com.iwaodev.infrastructure.model.listener.NotificationValidationListener;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EntityListeners(NotificationValidationListener.class)
//@NoArgsConstructor // use custom noargsconstructor to assign nanoId
@FilterDef(
    name = "recipientIdFilter",
    parameters = @ParamDef(name = "recipientId", type = "string")
)
@Filter(
    name = "recipientIdFilter",
    condition = "recipient_id = :recipientId"
)
@Entity(name = "notifications")
public class Notification {

  /**
   * use nanoId
   **/
  @Id
  @Column(name = "notification_id")
  private String notificationId;

  @Column(name="notification_title")
  private String notificationTitle;

  @Column(name="notification_description")
  private String notificationDescription;

  @ManyToOne
  @JoinColumn(name = "issuer_id", insertable = true, updatable = true)
  private User issuer;

  @ManyToOne
  @JoinColumn(name = "recipient_id", insertable = true, updatable = true)
  private User recipient;

  @Column(name="is_read")
  private Boolean isRead;

  @Column(name="link")
  private String link;

  @Column(name="note")
  private String note;

  @ManyToOne
  @JoinColumn(name = "notification_type_id", insertable = true, updatable = true)
  private NotificationType notificationType;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "readAt")
  private LocalDateTime readAt;

  // constructor
  public Notification() {
    this.notificationId = "ntf_" + NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR, NanoIdUtils.DEFAULT_ALPHABET, 11); 
  }

  // custom setters & getters

  // domain behaviors
  public void turnReadTrue() {
    this.setIsRead(true);
  }
  

}



