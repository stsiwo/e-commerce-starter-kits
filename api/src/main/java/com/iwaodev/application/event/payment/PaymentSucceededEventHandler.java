package com.iwaodev.application.event.payment;

import java.util.Optional;

import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.OrderService;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.PaymentSucceededEvent;
import com.iwaodev.domain.service.OrderEventService;
import com.iwaodev.domain.service.ProductStockService;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.ExceptionMessenger;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.CartItem;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;
import org.springframework.web.server.ResponseStatusException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class PaymentSucceededEventHandler implements ApplicationListener<PaymentSucceededEvent> {

  private static final Logger logger = LoggerFactory.getLogger(PaymentSucceededEventHandler.class);

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private OrderEventService orderEventService;

  /**
   * handle payment success event.
   *
   * 1. add an order event with PAID status.
   **/
  @Override
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void onApplicationEvent(PaymentSucceededEvent event) {
    logger.info("PaymentSucceededEventHandler called.");
    logger.info(Thread.currentThread().getName());

    // target order from db
    Optional<Order> orderOption = this.orderRepository.findByStripePaymentIntentId(event.getPaymentIntentId());

    if (orderOption.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "target order not found by its payment intent id");
    }

    Order order = orderOption.get();
    // get memberuser for order event
    Optional<User> userOption = this.userRepository.findByStipeCustomerId(event.getStripeCustomerId());

    // make sure the order' user == request user
    if (!userOption.isEmpty()) {
      if (!order.getUser().getUserId().equals(userOption.get().getUserId())) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "you cannot update an order for other member.");
      }
    }

    // add new order event
    try {
      if (userOption.isEmpty()) {
        logger.info("this is guest user");
        orderEventService.add(order, OrderStatusEnum.PAID, "", null);
      } else {
        logger.info("this is member user (id: " + userOption.get().getUserId().toString());
        orderEventService.add(order, OrderStatusEnum.PAID, "", userOption.get().getUserId());
      }
    } catch (DomainException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    } catch (NotFoundException e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    }

    // save
    this.orderRepository.save(order);
    /**
     * bug.
     *
     * hibernate return the same child entity twice in child list.
     * e.g, orderEvents: [ { 101 } , { 102 }, { 102 } ] <- 102 is duplicate.
     *
     * workaround: use 'flush'. 
     *
     * otherwise, you might got an error 'object references an unsaved transient instance – save the transient instance beforeQuery flushing'.
     *
     *  - this is because hibernate recognize that the entity change its state again by calling 'parent.getChildren().size()' wihtout flushing, so be careful!!!!
     *
     * ref: https://stackoverflow.com/questions/7903800/hibernate-inserts-duplicates-into-a-onetomany-collection
     *
     **/
    this.orderRepository.flush();

    // remove selected cart item from cart if the customer is member
    if (!userOption.isEmpty()) {
      
       User user = userOption.get();

       user.removeSelectedCartItems();     

       this.userRepository.save(user);
    }
  }
}
