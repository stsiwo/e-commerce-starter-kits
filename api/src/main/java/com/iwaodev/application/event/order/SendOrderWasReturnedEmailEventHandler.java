package com.iwaodev.application.event.order;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.mail.MessagingException;

import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.application.iservice.OrderService;
import com.iwaodev.config.ClientSpaConfig;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.order.event.PaymentSucceededEvent;
import com.iwaodev.domain.service.CreateNotificationService;
import com.iwaodev.domain.service.OrderEventService;
import com.iwaodev.domain.service.ProductStockService;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.ExceptionMessenger;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.CartItem;
import com.iwaodev.infrastructure.model.Company;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;
import org.springframework.web.server.ResponseStatusException;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class SendOrderWasReturnedEmailEventHandler {

  private static final Logger logger = LoggerFactory.getLogger(SendOrderWasReturnedEmailEventHandler.class);

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private EmailService emailService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private SpringTemplateEngine thymeleafTemplateEngine;

  @Autowired
  private ClientSpaConfig clientSpaConfig;

  /**
   * send an email for order is shipped successfully.
   *
   * include following: - greeting. - a list of items. - total price. (subtotal,
   * shipping cost, tax cost) - estimated delivery.
   **/
  @Async
  @TransactionalEventListener
  public void handleEvent(OrderEventWasAddedEvent event) {
    logger.info("start SendOrderWasReturnedEmailEventHandler called.");
    logger.info(Thread.currentThread().getName());

    if (!event.getOrder().retrieveLatestOrderEvent().getOrderStatus().equals(OrderStatusEnum.RETURNED)) {
      logger.info("order status is not 'returned' so do nothing.");
      return;
    }

    logger.info("order status is 'returned' so send an email.");
    // BCC
    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "the admin user does not exist"));
    // Sender
    Company company = admin.getCompanies().get(0);
    String senderEmail = "no-reply@" + company.getDomain();
    // Recipient
    String recipientEmail = event.getOrder().getOrderEmail();
    boolean isGuest = event.getOrder().getIsGuest();
    // order
    Order order = event.getOrder();

    Map<String, Object> templateModel = new HashMap<String, Object>();

    if (isGuest) {

    } else {
      // member
      templateModel.put("link", this.clientSpaConfig.getUrl() + "/orders/" + event.getOrder().getOrderId().toString());
    }

    // set model variables
    templateModel.put("order", order);
    templateModel.put("company", company);

    // prep variables for tmeplate html
    Context thymeleafContext = new Context();
    thymeleafContext.setVariables(templateModel);
    String htmlBody = thymeleafTemplateEngine.process("order-was-returned-email.html", thymeleafContext);

    logger.info(htmlBody);

    // send it
    try {
      this.emailService.send(recipientEmail, senderEmail,
          "Your Order Was Returned (Order #" + order.getOrderNumber(), htmlBody + ")");
    } catch (MessagingException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

  }
}

