package com.iwaodev.application.event.user;

import com.iwaodev.application.event.EventHandler;
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
public class AssignStripeCustomerIdEventHandler implements EventHandler<OrderFinalConfirmedEvent>{

  private static final Logger logger = LoggerFactory.getLogger(AssignStripeCustomerIdEventHandler.class);

  private UserRepository userRepository;

  @Autowired
  public AssignStripeCustomerIdEventHandler(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * when use @TransactionalEventListener with CrudRepository to persist data, this event handler must be under a transactional. Otherwise, it won't save it.
   *
   * you have two choices:
   *
   *  1. TransactionPhase.BEFORE_COMMIT
   *  2. @Transactional(propagation = Propagation.REQUIRES_NEW)
   *
   *  default (e.g., AFTER_COMMIT) won't work since the transaction is done already.
   *
   * ref: https://stackoverflow.com/questions/44752567/save-data-in-a-method-of-eventlistener-or-transactionaleventlistener
   */
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(OrderFinalConfirmedEvent event) {

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
