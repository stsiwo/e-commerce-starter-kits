package com.iwaodev.application.event.notification;

import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
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
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class CreateOrderEventNotificationEventHandler {

  private static final Logger logger = LoggerFactory.getLogger(CreateOrderEventNotificationEventHandler.class);

  @Autowired
  private CreateNotificationService createNotificationService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NotificationRepository notificationRepository;

  @Async
  @TransactionalEventListener()
  public void handleEvent(OrderEventWasAddedEvent event) throws AppException {
    logger.info("start CreateOrderEventNotificationEventHandler");
    logger.info(Thread.currentThread().getName());

    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));

    if (event.getOrder().getUser() != null) {
      try {
        // member user
        Notification notification = this.createNotificationService.create(
            NotificationTypeEnum.ORDER_STATUS_WAS_UPDATED_BY_ADMIN,
            String.format("Your order (order#: %s) was updated to %s. Please check the link for more detail.",
                event.getOrder().getOrderNumber(), event.getOrder().retrieveLatestOrderEvent().getOrderStatus()),
            admin, event.getOrder().getUser(),
            String.format("/order?orderId=%s", event.getOrder().getOrderId().toString()), "");

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
