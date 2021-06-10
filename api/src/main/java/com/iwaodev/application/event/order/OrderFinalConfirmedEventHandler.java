package com.iwaodev.application.event.order;

import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class OrderFinalConfirmedEventHandler{

  private static final Logger logger = LoggerFactory.getLogger(OrderFinalConfirmedEventHandler.class);

  @Autowired
  private OrderRepository orderRepository;

  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(OrderFinalConfirmedEvent event) {
    logger.info("test event is triggered");
    logger.info(Thread.currentThread().getName());

    logger.info("order repository exists");
    logger.info("" + this.orderRepository);
    this.orderRepository.hashCode();

    logger.info("done order final confirmed event handler");
  }

}
