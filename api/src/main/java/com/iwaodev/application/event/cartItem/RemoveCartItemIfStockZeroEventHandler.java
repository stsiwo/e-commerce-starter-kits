package com.iwaodev.application.event.cartItem;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.CartItemRepository;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.iservice.UserCartItemService;
import com.iwaodev.domain.order.event.PaymentSucceededEvent;
import com.iwaodev.domain.wishlistItem.event.MovedWishlistItemToCartItemEvent;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.CartItem;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.ui.criteria.cartItem.CartItemCriteria;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


/**
 * create a cart item since the user move it from wishlist.
 *
 * don't forget implements EventHandler<E>. this is used for testing.
 *
 **/
@Service
public class RemoveCartItemIfStockZeroEventHandler implements EventHandler<PaymentSucceededEvent> {

  private static final Logger logger = LoggerFactory.getLogger(RemoveCartItemIfStockZeroEventHandler.class);

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private CartItemRepository cartItemRepository;

  @Autowired
  private ProductRepository productRepository;

  /**
   * when use @TransactionalEventListener with CrudRepository to persist data, this event handler must be under a transactional. Otherwise, it won't save it.
   *
   * you have two choices:
   *
   *  1. TransactionPhase.BEFORE_COMMIT
   *  2. @Transactional(propagation = Propagation.REQUIRES_NEW)
   *
   *  default (e.g., AFTER_COMMIT) won't work since the transaction is done already.
   *
   * ref: https://stackoverflow.com/questions/44752567/save-data-in-a-method-of-eventlistener-or-transactionaleventlistener
   */
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(PaymentSucceededEvent event) throws AppException {

    // target order from db
    Optional<Order> orderOption = this.orderRepository.findByStripePaymentIntentId(event.getPaymentIntentId());

    if (!orderOption.isPresent()) {
      throw new AppException(HttpStatus.NOT_FOUND, "target order not found by its payment intent id");
    }

    Order order = orderOption.get();

    List<Long> cartItemIds = new ArrayList<>();

    for (OrderDetail orderDetail: order.getOrderDetails()) {
      ProductVariant variant = orderDetail.getProductVariant();
      if (variant == null) {
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "the order detail does not have any variant. this should not happen.");
      }
      Integer curStock = variant.getVariantStock();
      Integer soldQuantity = orderDetail.getProductQuantity();
      boolean isOutOfStock = curStock - soldQuantity <= 0;

      if (isOutOfStock) {
        List<CartItem> subCartItems = this.cartItemRepository.getAllByVariantId(variant.getVariantId());
        List<Long> subCartItemIds = subCartItems.stream().map(cartItem -> cartItem.getCartItemId()).collect(Collectors.toList());
        cartItemIds.addAll(subCartItemIds);
      }
    }

    this.cartItemRepository.deleteCartItems(cartItemIds);
  }
}

