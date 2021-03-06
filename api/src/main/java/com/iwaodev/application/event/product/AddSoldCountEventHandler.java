package com.iwaodev.application.event.product;

import java.util.List;
import java.util.Optional;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ProductRepository;
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

@Service
public class AddSoldCountEventHandler implements EventHandler<PaymentSucceededEvent>{

  private static final Logger logger = LoggerFactory.getLogger(AddSoldCountEventHandler.class);

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private ProductSoldCountService productSoldCountService;

  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(PaymentSucceededEvent event) throws AppException {

    logger.debug("start handleAddSoldCountEventHandler");
    logger.debug(Thread.currentThread().getName());

    // target order from db
    Optional<Order> orderOption = this.orderRepository.findByStripePaymentIntentId(event.getPaymentIntentId());

    if (!orderOption.isPresent()) {
      throw new AppException(HttpStatus.NOT_FOUND, "target order not found by its payment intent id");
    }

    Order order = orderOption.get();

    /**
     * increase the sold number for each ordered item after payment succeeded.
     *
     **/
    List<Product> products = null;
    try {
      products = this.productSoldCountService.add(order.getOrderDetails());
    } catch (NotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    }

    this.productRepository.saveAll(products);
  }
}
