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

import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.infrastructure.model.listener.OrderEventValidationListener;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@EntityListeners(OrderEventValidationListener.class)
@Entity(name = "orderEvents")
public class OrderEvent {

  @Id
  @Column(name = "order_event_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long orderEventId;

  @Column(name = "undoable")
  private Boolean undoable;

  @Column(name = "note")
  private String note;

  @Enumerated(EnumType.STRING)
  @Column(name = "order_status")
  private OrderStatusEnum orderStatus;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

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
}
