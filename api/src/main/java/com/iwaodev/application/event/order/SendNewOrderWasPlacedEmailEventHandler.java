package com.iwaodev.application.event.order;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.mail.MessagingException;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.application.iservice.OrderService;
import com.iwaodev.config.ClientSpaConfig;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.order.OrderStatusEnum;
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
import com.iwaodev.exception.AppException;
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
public class SendNewOrderWasPlacedEmailEventHandler implements EventHandler<PaymentSucceededEvent>{

  private static final Logger logger = LoggerFactory.getLogger(SendNewOrderWasPlacedEmailEventHandler.class);

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
   * send an email for order is completed successfully.
   *
   * include following: - greeting. - a list of items. - total price. (subtotal,
   * shipping cost, tax cost) - estimated delivery.
   **/
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
  @Async
  @TransactionalEventListener
  public void handleEvent(PaymentSucceededEvent event) throws AppException {
    logger.debug("start SendNewOrderWasPlacedEmailEventHandler called.");
    logger.debug(Thread.currentThread().getName());

    // order
    Order order = this.orderRepository.findByStripePaymentIntentId(event.getPaymentIntentId())
        .orElseThrow(
            () -> new AppException(HttpStatus.NOT_FOUND, "target order not found by its payment intent id"));

    // admin
    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "the admin user does not exist"));

    // Sender
    Company company = admin.getCompanies().get(0);
    String senderEmail = "no-reply@" + company.getDomain();
    String from = String.format("%s <%s>", company.getCompanyName(), senderEmail);
    String[] bcc = { admin.getEmail() };

    // Recipient
    // admin and company email
    Map<String, Object> templateModel = new HashMap<String, Object>();

    // set model variables
    templateModel.put("order", order);
    templateModel.put("admin", admin);
    templateModel.put("link",
        this.clientSpaConfig.getUrl() + "/admin/orders?orderId=" + order.getOrderId().toString());

    // prep variables for tmeplate html
    Context thymeleafContext = new Context();
    thymeleafContext.setVariables(templateModel);
    String htmlBody = thymeleafTemplateEngine.process("new-order-was-placed-email.html", thymeleafContext);

    logger.debug(htmlBody);

    // send it
    try {
      logger.debug(String.format("To: %s, From: %s", admin.getEmail(), senderEmail));
      this.emailService.send(admin.getEmail(), from, bcc,
          "A New Order Was Placed By Customer (Order #: " + order.getOrderNumber() + ")", htmlBody);
    } catch (MessagingException e) {
      logger.debug(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "encountered errors during sending new-order-was-placed email. please try again.");
    }

  }
}
