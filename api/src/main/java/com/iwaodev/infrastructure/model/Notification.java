package com.iwaodev.infrastructure.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.notification.validator.IssuerValidation;
import com.iwaodev.domain.notification.validator.RecipientValidation;
import com.iwaodev.infrastructure.model.listener.NotificationValidationListener;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.FilterDefs;
import org.hibernate.annotations.Filters;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.ToString;

@IssuerValidation
@RecipientValidation
@Data
@ToString
@EntityListeners(NotificationValidationListener.class)
// @NoArgsConstructor // use custom noargsconstructor to assign nanoId
@FilterDefs({ 
    @FilterDef(name = "recipientIdFilter", parameters = @ParamDef(name = "recipientId", type = "string")),
    @FilterDef(name = "isReadFilter", parameters = @ParamDef(name = "isRead", type = "boolean"))
})
@Filters({ 
  @Filter(name = "recipientIdFilter", condition = "recipient_id = :recipientId"),
  @Filter(name = "isReadFilter", condition = "is_read = :isRead"),
})
@Entity(name = "notifications")
public class Notification {

  /**
   * use nanoId
   **/
  @NotNull(message = "{notification.id.notnull}")
  @Id
  @Column(name = "notification_id")
  private String notificationId;

  @NotEmpty(message = "{notification.title.notempty}")
  @Column(name = "notification_title")
  private String notificationTitle;

  @NotEmpty(message = "{notification.description.notempty}")
  @Column(name = "notification_description")
  private String notificationDescription;

  @ManyToOne
  @JoinColumn(name = "issuer_id", insertable = true, updatable = true)
  private User issuer;

  @ManyToOne
  @JoinColumn(name = "recipient_id", insertable = true, updatable = true)
  private User recipient;

  @NotNull(message = "{notification.isRead.notnull}")
  @Column(name = "is_read")
  private Boolean isRead;

  @Column(name = "link")
  private String link;

  @Column(name = "note")
  private String note;

  @NotNull(message = "{notification.notificationType.notnull}")
  @ManyToOne
  @JoinColumn(name = "notification_type_id", insertable = true, updatable = true)
  private NotificationType notificationType;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "readAt")
  private LocalDateTime readAt;

  @Version
  @Column(name = "version")
  private Long version = 0L;

  // constructor
  public Notification() {
    this.notificationId = "ntf_"
        + NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR, NanoIdUtils.DEFAULT_ALPHABET, 11);
  }

  // custom setters & getters

  // domain behaviors
  public void turnReadTrue() {
    this.setIsRead(true);
  }

  public boolean isGuestIssuerByTypeOf(NotificationTypeEnum type) {
    if (type.equals(NotificationTypeEnum.ORDER_WAS_PLACED_BY_ANONYMOUS)) {
      return true;
    }
    return false;
  }

}
