package com.iwaodev.domain.order.event;

import com.iwaodev.domain.user.UserTypeEnum;
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
public class OrderFinalConfirmedEvent extends ApplicationEvent {

  private static final long serialVersionUID = 1L;

  private Order order;

  private String stripeCustomerId;

  private UserTypeEnum userType;

  public OrderFinalConfirmedEvent(Object source, Order order, String stripeCustomerId, UserTypeEnum userType) {
    super(source);
    this.order = order;
    this.stripeCustomerId = stripeCustomerId;
    this.userType = userType;
  }

}
