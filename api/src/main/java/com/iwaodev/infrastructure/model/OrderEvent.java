package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Size;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.validator.OrderEventValidation;
import com.iwaodev.infrastructure.model.listener.OrderEventListener;
import com.iwaodev.infrastructure.model.listener.OrderEventValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

// DOUBT this might need to be removed and move teh validation to the service layer.
@OrderEventValidation()
@Data
@ToString
/**
 * order & orderEvent cause stackoverflow with its lombok hashcode.
 * so exclude it. ref: https://stackoverflow.com/questions/34972895/lombok-hashcode-issue-with-java-lang-stackoverflowerror-null
 **/
@EqualsAndHashCode(exclude = {"order"})
@NoArgsConstructor
@EntityListeners( value = { OrderEventValidationListener.class })
@Entity(name = "orderEvents")
public class OrderEvent {

  @Null(message = "{orderEvent.id.null}", groups = OnCreate.class)
  @NotNull(message = "{orderEvent.id.notnull}", groups = OnUpdate.class)
  @Id
  @Column(name = "order_event_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long orderEventId;

  @NotNull(message = "{orderEvent.undoable.notnull}")
  @Column(name = "undoable")
  private Boolean undoable;

  @Size(max = 1000, message = "{orderEvent.note.max1000}")
  @Column(name = "note")
  private String note;

  @NotNull(message = "{orderEvent.isGuest.notnull}")
  // user is guest or not for this order event
  @Column(name = "is_guest")
  private Boolean isGuest;

  @NotNull(message = "{orderEvent.orderStatus.notnull}")
  @Enumerated(EnumType.STRING)
  @Column(name = "order_status")
  private OrderStatusEnum orderStatus;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @NotNull(message = "{orderEvent.order.notnull}")
  @ManyToOne
  @JoinColumn(name = "order_id")
  private Order order;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  public OrderEvent(OrderStatusEnum orderStatus, Boolean undoable, String note) {
    this.orderStatus = orderStatus;
    this.undoable = undoable;
    this.note = note;
  }

  public OrderEvent(OrderStatusEnum orderStatus) {
    this.orderStatus = orderStatus;
  }

  public boolean isAddableByMember() {
    if (this.orderStatus.equals(OrderStatusEnum.CANCEL_REQUEST) || this.orderStatus.equals(OrderStatusEnum.RETURN_REQUEST)) {
      return true;
    }
    return false;
  }
}
