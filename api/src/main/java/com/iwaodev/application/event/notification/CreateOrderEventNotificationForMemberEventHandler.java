package com.iwaodev.application.event.notification;

import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedByMemberEvent;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.service.CreateNotificationService;
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
import org.springframework.web.server.ResponseStatusException;

@Service
public class CreateOrderEventNotificationForMemberEventHandler {

  private static final Logger logger = LoggerFactory.getLogger(CreateOrderEventNotificationForMemberEventHandler.class);

  @Autowired
  private CreateNotificationService createNotificationService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NotificationRepository notificationRepository;

  @Async
  @TransactionalEventListener()
  public void handleEvent(OrderEventWasAddedByMemberEvent event) {
    logger.info("start CreateOrderEventNotificationEventHandler");
    logger.info(Thread.currentThread().getName());

    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));

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
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
      }
    } else {
      // guest user
      //
      // do nothing about notification.
    }

  }

}
