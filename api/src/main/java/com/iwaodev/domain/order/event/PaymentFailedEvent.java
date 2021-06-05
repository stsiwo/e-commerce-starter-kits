package com.iwaodev.domain.order.event;

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
public class PaymentFailedEvent extends ApplicationEvent {

  private static final long serialVersionUID = 1L;

  private String paymentIntentId;

  public PaymentFailedEvent(Object source, String paymentIntentId) {
    super(source);
    this.paymentIntentId = paymentIntentId;
  }

}

