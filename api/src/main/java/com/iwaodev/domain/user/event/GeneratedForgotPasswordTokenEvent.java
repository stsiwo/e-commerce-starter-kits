package com.iwaodev.domain.user.event;

import com.iwaodev.infrastructure.model.User;

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
public class GeneratedForgotPasswordTokenEvent extends ApplicationEvent {

  private static final long serialVersionUID = 1L;

  private User user;

  public GeneratedForgotPasswordTokenEvent(Object source, User user) {
    super(source);
    this.user = user;
  }
}
