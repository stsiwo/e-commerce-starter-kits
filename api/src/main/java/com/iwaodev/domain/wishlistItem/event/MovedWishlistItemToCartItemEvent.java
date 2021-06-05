package com.iwaodev.domain.wishlistItem.event;

import java.util.UUID;

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
public class MovedWishlistItemToCartItemEvent extends ApplicationEvent {

  private static final long serialVersionUID = 1L;

  private Long variantId;

  private UUID userId;

  public MovedWishlistItemToCartItemEvent(Object source, UUID userId,  Long variantId) {
    super(source);
    this.variantId = variantId;
    this.userId = userId;
  }
}

