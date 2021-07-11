package com.iwaodev.application.event.order;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.mail.MessagingException;

import com.iwaodev.annotation.EventHandlerCheck;
import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.event.EventHandlerChecker;
import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.application.iservice.OrderService;
import com.iwaodev.application.iservice.PaymentService;
import com.iwaodev.config.ClientSpaConfig;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.order.event.PaymentSucceededEvent;
import com.iwaodev.domain.service.CreateNotificationService;
import com.iwaodev.domain.service.OrderEventService;
import com.iwaodev.domain.service.ProductStockService;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.ExceptionMessenger;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.CartItem;
import com.iwaodev.infrastructure.model.Company;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;
import com.stripe.exception.StripeException;
import com.iwaodev.exception.AppException;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * send refund payment request. 
 *
 * don't forget implements EventHandler<E>. this is used for testing.
 *
 **/
@Service
public class RefundPaymentEventHandler implements EventHandler<OrderEventWasAddedEvent> {

  private static final Logger logger = LoggerFactory.getLogger(RefundPaymentEventHandler.class);

  @Autowired
  private PaymentService paymentService;

  @Autowired
  private EventHandlerChecker eventHandlerChecker;

  @Autowired
  private OrderRepository orderRepository;

  /**
   * refund the payment with Stripe .
   *
   * this must be called when order event (CANCELED/RETURNED) was added to the
   * order events.
   *
   * this event handler is shared by the use cases of 'CANCELED' and 'RETURNED'.
   *
   * this must be sync since if one of the step failed, it cannot be completed.
   **/
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(OrderEventWasAddedEvent event) throws AppException {
    logger.info("start RefundPaymentEventHandler called.");
    logger.info(Thread.currentThread().getName());
    logger.info("" + this.eventHandlerChecker);
    logger.info(this.eventHandlerChecker.check(this.getClass().getName()));

    this.orderRepository.findAll();

    if (event.getOrder().retrieveLatestOrderEvent() == null) {
      logger.info("this order does not have any event so do nothing.");
      return;
    }

    logger.info("order event name: " + event.getOrder().retrieveLatestOrderEvent().getOrderStatus());

    if (!event.getOrder().retrieveLatestOrderEvent().getOrderStatus().equals(OrderStatusEnum.CANCELED)
        && !event.getOrder().retrieveLatestOrderEvent().getOrderStatus().equals(OrderStatusEnum.RETURNED)) {
      logger.info("order status is not 'canceled'/'returned' so do nothing.");
      return;
    }

    logger.info("order status is 'canceled'/'returned' so cancel the payment with Stripe.");
    // order
    Order order = event.getOrder();
    /**
     * prep refund request to stripe
     *
     * - get paymentIntentId from the order
     **/
    String paymentIntentId = order.getStripePaymentIntentId();

    /**
     * send refund request to Stripe
     *
     * - error handling esp when failed to refund
     **/
    try {
      this.paymentService.requestRefund(paymentIntentId);
    } catch (StripeException e) {
      logger.info(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
    logger.info("payment was refund successfully:)");
  }
}
