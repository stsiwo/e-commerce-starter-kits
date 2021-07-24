package com.iwaodev.application.event.notification;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedByMemberEvent;
import com.iwaodev.domain.service.CreateNotificationService;
import com.iwaodev.exception.AppException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * create a notification for an order was placed.
 *
 * 
 * don't forget implements EventHandler<E>. this is used for testing.
 *
 **/
@Service
public class CreateOrderEventNotificationForMemberEventHandler implements EventHandler<OrderEventWasAddedByMemberEvent> {

  private static final Logger logger = LoggerFactory.getLogger(CreateOrderEventNotificationForMemberEventHandler.class);

  @Autowired
  private CreateNotificationService createNotificationService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NotificationRepository notificationRepository;

  @Async
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(OrderEventWasAddedByMemberEvent event) throws AppException {
    logger.info("start CreateOrderEventNotificationEventHandler");
    logger.info(Thread.currentThread().getName());

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
    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));

    if (event.getOrder().getUser() != null) {
      try {
        // member user
        Notification notification = this.createNotificationService.create(
            NotificationTypeEnum.ORDER_STATUS_WAS_UPDATED_BY_MEMBER,
            String.format("An order (order#: %s) was updated to %s by %s. Please check the link for more detail.",
                event.getOrder().getOrderNumber(), event.getOrder().retrieveLatestOrderEvent().getOrderStatus(),
                event.getOrder().getFullName()),
            event.getOrder().getUser(), admin,
            String.format("/admin/orders?orderId=%s", event.getOrder().getOrderId().toString()), "");

        this.notificationRepository.save(notification);
      } catch (NotFoundException e) {
        throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
      }
    } else {
      // guest user
      //
      // do nothing about notification.
    }

  }

}
