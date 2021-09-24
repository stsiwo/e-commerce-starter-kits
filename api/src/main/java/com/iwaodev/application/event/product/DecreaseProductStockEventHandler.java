package com.iwaodev.application.event.product;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.service.ProductStockService;
import com.iwaodev.exception.AppException;
import com.iwaodev.exception.ExceptionMessenger;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.exception.OutOfStockException;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.Product;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class DecreaseProductStockEventHandler implements EventHandler<OrderFinalConfirmedEvent>{

  private static final Logger logger = LoggerFactory.getLogger(DecreaseProductStockEventHandler.class);

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ProductStockService productStockService;

  @Autowired
  private ExceptionMessenger ExceptionMessenger;

  // this must be the same transaction.
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(OrderFinalConfirmedEvent event) throws AppException {

    logger.debug("start handling at DecreaseProductStockEventHandler: order_id = " + event.getOrder().getOrderId().toString());
    /**
     * decrease the stock number by the quantity of each order details
     **/
    List<Product> products = new ArrayList<>();

    try {
      products = this.productStockService.take(event.getOrder().getOrderDetails());
    } catch (NotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    } catch (OutOfStockException e) {
      throw new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    this.productRepository.saveAll(products);
  }
}
