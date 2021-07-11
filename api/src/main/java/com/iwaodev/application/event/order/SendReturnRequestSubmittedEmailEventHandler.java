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
import com.iwaodev.domain.order.event.OrderEventWasAddedByMemberEvent;
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
public class SendReturnRequestSubmittedEmailEventHandler implements EventHandler<OrderEventWasAddedByMemberEvent>{

  private static final Logger logger = LoggerFactory.getLogger(SendReturnRequestSubmittedEmailEventHandler.class);

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
  @Async
  @TransactionalEventListener
  public void handleEvent(OrderEventWasAddedByMemberEvent event) throws AppException {
    logger.info("start SendReturnRequestSubmittedEmailEventHandler called.");
    logger.info(Thread.currentThread().getName());

    if (!event.getOrder().retrieveLatestOrderEvent().getOrderStatus().equals(OrderStatusEnum.RETURN_REQUEST)) {
      logger.info("order status is not 'return_request' so do nothing.");
      return;
    }

    logger.info("order status is 'return_request' so send an email.");
    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "the admin user does not exist"));

    // Sender
    Company company = admin.getCompanies().get(0);
    String senderEmail = "no-reply@" + company.getDomain();
    String from = String.format("%s <%s>", company.getCompanyName(), senderEmail);

    // Recipient
    // admin and company email
    boolean isGuest = event.getOrder().getIsGuest();

    // order
    Order order = event.getOrder();

    Map<String, Object> templateModel = new HashMap<String, Object>();

    // set model variables
    templateModel.put("order", order);
    templateModel.put("admin", admin);
    templateModel.put("link",
        this.clientSpaConfig.getUrl() + "/admin/orders?orderId=" + event.getOrder().getOrderId().toString());

    // prep variables for tmeplate html
    Context thymeleafContext = new Context();
    thymeleafContext.setVariables(templateModel);
    String htmlBody = thymeleafTemplateEngine.process("order-return-request-submitted-email.html", thymeleafContext);

    logger.info(htmlBody);

    // send it
    try {
      logger.info(String.format("To: %s, From: %s", admin.getEmail(), senderEmail));
      this.emailService.send(admin.getEmail(), from,
          "A Return Request Was Submitted By Customer (Order #: " + order.getOrderNumber() + ")", htmlBody);
    } catch (MessagingException e) {
      logger.info(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

  }
}
