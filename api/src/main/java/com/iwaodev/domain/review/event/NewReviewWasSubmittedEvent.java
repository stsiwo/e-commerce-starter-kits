package com.iwaodev.domain.review.event;

import com.iwaodev.infrastructure.model.Review;

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
public class NewReviewWasSubmittedEvent extends ApplicationEvent {

  private static final long serialVersionUID = 1L;

  private Review review;

  public NewReviewWasSubmittedEvent(Object source, Review review) {
    super(source);
    this.review = review;
  }
}


