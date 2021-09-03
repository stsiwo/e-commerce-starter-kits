package com.iwaodev.application.event.product;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.service.ProductStockService;
import com.iwaodev.exception.AppException;
import com.iwaodev.exception.ExceptionMessenger;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.exception.OutOfStockException;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.ArrayList;
import java.util.List;

@Service
public class GetProductStockBackEventHandler implements EventHandler<OrderEventWasAddedEvent>{

  private static final Logger logger = LoggerFactory.getLogger(GetProductStockBackEventHandler.class);

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ProductStockService productStockService;

  @Autowired
  private ExceptionMessenger ExceptionMessenger;

  // this must be the same transaction.
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(OrderEventWasAddedEvent event) throws AppException {

    if (event.getOrder().retrieveLatestOrderEvent() == null) {
      logger.debug("this order does not have any event so do nothing.");
      return;
    }

    if (!event.getOrder().retrieveLatestOrderEvent().getOrderStatus().equals(OrderStatusEnum.CANCELED)
            && !event.getOrder().retrieveLatestOrderEvent().getOrderStatus().equals(OrderStatusEnum.RETURNED)) {
      logger.debug("order status is not 'canceled'/'returned' so do nothing.");
      return;
    }
    // order
    Order order = event.getOrder();
    /**
     * decrease the stock number by the quantity of each order details
     **/
    List<Product> products = new ArrayList<>();

    try {
      products = this.productStockService.restore(event.getOrder().getOrderDetails());
      this.productRepository.saveAll(products);
    } catch (NotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    }

  }
}
