package com.iwaodev.application.event.cartItem;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.CartItemRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.iservice.UserCartItemService;
import com.iwaodev.domain.wishlistItem.event.MovedWishlistItemToCartItemEvent;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.ui.criteria.cartItem.CartItemCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;


/**
 * create a cart item since the user move it from wishlist.
 *
 * don't forget implements EventHandler<E>. this is used for testing.
 *
 **/
@Service
public class CreateCartItemEventHandler implements EventHandler<MovedWishlistItemToCartItemEvent> {

  private static final Logger logger = LoggerFactory.getLogger(CreateCartItemEventHandler.class);

  @Autowired
  private CartItemRepository cartItemRepository;

  @Autowired
  private UserCartItemService userCartItemService;

  @Autowired
  private ProductRepository productRepository;

  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(MovedWishlistItemToCartItemEvent event) throws AppException {

    logger.info(Thread.currentThread().getName());

    // if this variant does not have stock return bad_request.
    if (this.productRepository.isOutOfStock(event.getVariantId())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the variant does not have any stock.");
    }

    // prepare criteria
    CartItemCriteria criteria = new CartItemCriteria();
    criteria.setUserId(event.getUserId());
    criteria.setVariantId(event.getVariantId());
    criteria.setIsSelected(true);
    criteria.setQuantity(1);

    // call service#add
    try {
      this.userCartItemService.add(criteria);
    } catch (Exception e) {
      throw new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
  }
}

