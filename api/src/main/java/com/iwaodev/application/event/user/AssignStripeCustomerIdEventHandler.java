package com.iwaodev.application.event.user;

import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class AssignStripeCustomerIdEventHandler implements ApplicationListener<OrderFinalConfirmedEvent> {

  private static final Logger logger = LoggerFactory.getLogger(AssignStripeCustomerIdEventHandler.class);

  private UserRepository userRepository;

  @Autowired
  public AssignStripeCustomerIdEventHandler(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void onApplicationEvent(OrderFinalConfirmedEvent event) {

    logger.info("start handleOrderFinalConfirmedEventHandler");
    logger.info(Thread.currentThread().getName());

    /**
     * assuming this customer is member.
     *
     * if he is guest, this event handler shouldn't be called.
     *
     **/
    if (event.getUserType().equals(UserTypeEnum.MEMBER)) {
      logger.info("updating stripe customer id since this is member user.");
      User customer = event.getOrder().getUser();
      customer.setStripeCustomerId(event.getStripeCustomerId());
      this.userRepository.save(customer);
    } else {
      logger.info("skip updating stripe customer id since this is guest user.");
    }
  }
}