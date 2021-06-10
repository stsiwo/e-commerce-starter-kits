package com.iwaodev.application.event.payment;

import java.util.List;
import java.util.Optional;

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
public class PaymentFailedEventHandler{

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
  public void handleEvent(PaymentFailedEvent event) {
    logger.info("start handling PaymentFailedEventHandler");
    logger.info(Thread.currentThread().getName());

    // target order from db
    Optional<Order> orderOption = this.orderRepository.findByStripePaymentIntentId(event.getPaymentIntentId());

    if (orderOption.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "target order not found by its payment intent id");
    }

    logger.info("before ueserRepo.getAdmin");

    Order order = orderOption.get();
    // get admin user for order event
    User admin = this.userRepository.getAdmin().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
        this.exceptionMessenger.getNotFoundMessage("admin", null)));

    logger.info("before orderEventService.add");
    // add new order event
    try {
      orderEventService.add(order, OrderStatusEnum.PAYMENT_FAILED, "", admin.getUserId());
    } catch (DomainException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    } catch (NotFoundException e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    }

    logger.info("before productStockService.restore");
    // restore product stock
    try {
      List<Product> products = this.productStockService.restore(order.getOrderDetails());
      this.productRepository.saveAll(products);
    } catch (NotFoundException e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    }

    

    logger.info("before save");
    logger.info("order event size");
    logger.info("" + order.getOrderEvents().size());

    // save
    this.orderRepository.save(order);
    
    logger.info("after save");
  }

}

