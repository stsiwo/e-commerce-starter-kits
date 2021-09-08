package com.iwaodev.application.event.order;

import java.util.HashMap;
import java.util.Map;

import javax.mail.MessagingException;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.config.ClientSpaConfig;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Company;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionalEventListener;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

@Service
public class SendOrderWasReturnedEmailEventHandler implements EventHandler<OrderEventWasAddedEvent> {

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
  public void handleEvent(OrderEventWasAddedEvent event) throws AppException {
    logger.debug("start SendOrderWasReturnedEmailEventHandler called.");
    logger.debug(Thread.currentThread().getName());

    if (!event.getOrder().retrieveLatestOrderEvent().getOrderStatus().equals(OrderStatusEnum.RETURNED)) {
      logger.debug("order status is not 'returned' so do nothing.");
      return;
    }

    // BCC
    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "the admin user does not exist"));
    // Sender
    Company company = admin.getCompanies().get(0);
    String senderEmail = "no-reply@" + company.getDomain();
    String from = String.format("%s <%s>", company.getCompanyName(), senderEmail);

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

    logger.debug(htmlBody);

    // send it
    try {
      logger.debug(String.format("To: %s, From: %s", recipientEmail, senderEmail));
      this.emailService.send(recipientEmail, from,
          String.format("Your Order Was Returned (Order #: %s)", order.getOrderNumber()), htmlBody);
    } catch (MessagingException e) {
      logger.debug(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "encountered errors during sending order-was-returned email. please try again.");
    }

  }
}

