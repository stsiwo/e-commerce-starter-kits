package com.iwaodev.application.event.payment;

import java.util.Optional;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.OrderService;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.PaymentSucceededEvent;
import com.iwaodev.domain.service.CreateNotificationService;
import com.iwaodev.domain.service.OrderEventService;
import com.iwaodev.domain.service.ProductStockService;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.ExceptionMessenger;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.CartItem;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.Order;
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
public class PaymentSucceededEventHandler implements EventHandler<PaymentSucceededEvent>{

  private static final Logger logger = LoggerFactory.getLogger(PaymentSucceededEventHandler.class);

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private OrderEventService orderEventService;

  @Autowired
  private CreateNotificationService createNotificationService;

  @Autowired
  private NotificationRepository notificationRepository;

  /**
   * handle payment success event.
   *
   * 1. add an order event with PAID status. 2. publish notification.
   *
   * TODO: refactor this. 
   *
   *  - create 3 event handler for payment succeeded event triggered by stripe api.
   *
   *    1. add an order event (ORDERED&PAID)
   *    2. remove cartItem from the user's cart
   *    3. create notificaiton.
   *
   *    you are packing too much in this event handler.
   *
   **/
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(PaymentSucceededEvent event) throws AppException {
    logger.debug("PaymentSucceededEventHandler called.");
    logger.debug(Thread.currentThread().getName());

    // target order from db
    Optional<Order> orderOption = this.orderRepository.findByStripePaymentIntentId(event.getPaymentIntentId());

    if (!orderOption.isPresent()) {
      throw new AppException(HttpStatus.NOT_FOUND, "target order not found by its payment intent id");
    }

    Order order = orderOption.get();
    // get customer 
    Optional<User> userOption = this.userRepository.findByStipeCustomerId(event.getStripeCustomerId());

    // make sure the order' user == request user
    if (userOption.isPresent()) {
      if (!order.getUser().getUserId().equals(userOption.get().getUserId())) {
        throw new AppException(HttpStatus.BAD_REQUEST, "you cannot update an order for other member.");
      }
    }
    // get admin for new order event

    // add new order event
    try {
      if (!userOption.isPresent()) {
        orderEventService.addByProgram(order, OrderStatusEnum.ORDERED, "", (User) null);
        orderEventService.addByProgram(order, OrderStatusEnum.PAID, "", (User)null);
      } else {
        orderEventService.addByProgram(order, OrderStatusEnum.ORDERED, "", userOption.get());
        orderEventService.addByProgram(order, OrderStatusEnum.PAID, "", userOption.get());
      }
    } catch (DomainException e) {
      throw new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
    } catch (NotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    }

    // save
    Order savedOrder = this.orderRepository.save(order);
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

    // remove selected cart item from cart if the customer is member
    if (userOption.isPresent()) {

      User user = userOption.get();

      user.removeSelectedCartItems();

      this.userRepository.save(user);
    }

    /**
     * 2. publish notification.
     *
     **/
    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));
    Notification notification;

    try {
      if (userOption.isPresent()) {
        User user = userOption.get();
        // member
        notification = this.createNotificationService.create(NotificationTypeEnum.ORDER_WAS_PLACED_BY_MEMBER,
            String.format("A new order was placed by %s (order#: %s).", user.getFullName(),
                savedOrder.getOrderNumber()),
            user, admin, String.format("/admin/orders?orderId=%s", savedOrder.getOrderId().toString()), "");
      } else {
        // anonymous
        notification = this.createNotificationService.create(NotificationTypeEnum.ORDER_WAS_PLACED_BY_ANONYMOUS,
            String.format("A new order was placed by %s (order#: %s).", savedOrder.getFullName(),
                savedOrder.getOrderNumber()),
            null, admin, String.format("/admin/orders?orderId=%s", savedOrder.getOrderId().toString()), "");
      }
    } catch (NotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    }

    this.notificationRepository.save(notification);
  }
}
