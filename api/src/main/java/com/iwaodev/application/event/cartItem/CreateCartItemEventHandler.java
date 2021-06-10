package com.iwaodev.application.event.cartItem;

import com.iwaodev.application.irepository.CartItemRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.UserCartItemService;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.wishlistItem.event.MovedWishlistItemToCartItemEvent;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.CartItemCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CreateCartItemEventHandler {

  private static final Logger logger = LoggerFactory.getLogger(CreateCartItemEventHandler.class);

  private CartItemRepository cartItemRepository;

  private UserCartItemService userCartItemService;

  @Autowired
  public CreateCartItemEventHandler(CartItemRepository cartItemRepository, UserCartItemService userCartItemService) {
    this.cartItemRepository = cartItemRepository;
    this.userCartItemService = userCartItemService;
  }

  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(MovedWishlistItemToCartItemEvent event) {

    logger.info(Thread.currentThread().getName());

    // prepare criteria
    CartItemCriteria criteria = new CartItemCriteria();
    criteria.setUserId(event.getUserId());
    criteria.setVariantId(event.getVariantId());
    criteria.setIsSelected(true);
    criteria.setQuantity(1);

    // call service#add
    this.userCartItemService.add(criteria);
  }
}

