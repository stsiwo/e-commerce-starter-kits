package com.iwaodev.application.event.product;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.order.event.PaymentFailedEvent;
import com.iwaodev.domain.order.event.PaymentSucceededEvent;
import com.iwaodev.domain.service.ProductSoldCountService;
import com.iwaodev.exception.AppException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;
import java.util.Optional;

@Service
public class GetSoldCountBackEventHandler implements EventHandler<OrderEventWasAddedEvent>{

  private static final Logger logger = LoggerFactory.getLogger(GetSoldCountBackEventHandler.class);

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private ProductSoldCountService productSoldCountService;

  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(OrderEventWasAddedEvent event) throws AppException {

    logger.debug("start handleAddSoldCountEventHandler");
    logger.debug(Thread.currentThread().getName());

    if (event.getOrder().retrieveLatestOrderEvent() == null) {
      logger.debug("this order does not have any event so do nothing.");
      return;
    }

    if (!event.getOrder().retrieveLatestOrderEvent().getOrderStatus().equals(OrderStatusEnum.CANCELED)
            && !event.getOrder().retrieveLatestOrderEvent().getOrderStatus().equals(OrderStatusEnum.RETURNED)) {
      logger.debug("order status is not 'canceled'/'returned' so do nothing.");
      return;
    }
    Order order = event.getOrder();

    /**
     * increase the sold number for each ordered item after payment succeeded.
     *
     **/
    List<Product> products = null;
    try {
      products = this.productSoldCountService.getBack(order.getOrderDetails());
      this.productRepository.saveAll(products);
    } catch (NotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    }
  }
}
