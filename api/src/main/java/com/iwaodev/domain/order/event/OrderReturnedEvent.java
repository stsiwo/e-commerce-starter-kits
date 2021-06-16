package com.iwaodev.domain.order.event;

import com.iwaodev.infrastructure.model.Order;

import org.springframework.context.ApplicationEvent;

import lombok.Getter;

/**
 * POJO event class
 *
 * - you can instantiate this object and put it as argument of 'registerEvent'
 * method where you implement 'AbstractAggregateRoot'
 *
 * - events are immutable.
 *
 **/
@Getter
public class OrderReturnedEvent extends ApplicationEvent {

  private static final long serialVersionUID = 1L;

  private Order order;

  public OrderReturnedEvent(Object source, Order order) {
    super(source);
    this.order = order;
  }
}
