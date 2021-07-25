package com.iwaodev.application.event.payment;

import java.util.List;
import java.util.Optional;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.OrderService;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.PaymentFailedEvent;
import com.iwaodev.domain.service.OrderEventService;
import com.iwaodev.domain.service.ProductStockService;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.ExceptionMessenger;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;
import com.iwaodev.exception.AppException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class PaymentFailedEventHandler implements EventHandler<PaymentFailedEvent>{

  private static final Logger logger = LoggerFactory.getLogger(PaymentFailedEventHandler.class);

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private OrderEventService orderEventService;

  @Autowired
  private ProductStockService productStockService;

  @Autowired
  private ExceptionMessenger exceptionMessenger;

  /**
   * handle payment failed event.
   *
   * 1. add an order event with PAYMENT_FAILED status.
   * 2. restore the product stock.
   **/
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(PaymentFailedEvent event) throws AppException {
    logger.debug("start handling PaymentFailedEventHandler");
    logger.debug("thread name: " + Thread.currentThread().getName());

    // target order from db
    Optional<Order> orderOption = this.orderRepository.findByStripePaymentIntentId(event.getPaymentIntentId());

    if (!orderOption.isPresent()) {
      throw new AppException(HttpStatus.NOT_FOUND, "target order not found by its payment intent id");
    }
    // get customer
    Optional<User> userOption = this.userRepository.findByStipeCustomerId(event.getStripeCustomerId());

    Order order = orderOption.get();
    // make sure the order' user == request user
    if (userOption.isPresent()) {
      if (!order.getUser().getUserId().equals(userOption.get().getUserId())) {
        throw new AppException(HttpStatus.BAD_REQUEST, "you cannot update an order for other member.");
      }
    }
    // add new order event
    try {
      if (!userOption.isPresent()) {
        logger.debug("this is guest user");
        orderEventService.addByProgram(order, OrderStatusEnum.ORDERED, "", (User)null);
        orderEventService.addByProgram(order, OrderStatusEnum.PAYMENT_FAILED, "", (User)null);
      } else {
        logger.debug("this is member user (id: " + userOption.get().getUserId().toString());
        orderEventService.addByProgram(order, OrderStatusEnum.ORDERED, "", userOption.get());
        orderEventService.addByProgram(order, OrderStatusEnum.PAYMENT_FAILED, "", userOption.get());
      }
    } catch (DomainException e) {
      throw new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
    } catch (NotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    }

    // save
    this.orderRepository.save(order);
    /**
     * bug.
     *
     * hibernate return the same child entity twice in child list. e.g, orderEvents:
     * [ { 101 } , { 102 }, { 102 } ] <- 102 is duplicate.
     *
     * workaround: use 'flush'.
     *
     * otherwise, you might got an error 'object references an unsaved transient
     * instance – save the transient instance beforeQuery flushing'.
     *
     * - this is because hibernate recognize that the entity change its state again
     * by calling 'parent.getChildren().size()' wihtout flushing, so be careful!!!!
     *
     * ref:
     * https://stackoverflow.com/questions/7903800/hibernate-inserts-duplicates-into-a-onetomany-collection
     *
     **/
    this.orderRepository.flush();

    /**
     * 2. restore product stock.
     **/
    try {
      List<Product> products = this.productStockService.restore(order.getOrderDetails());
      this.productRepository.saveAll(products);
    } catch (NotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    }
  }
}

