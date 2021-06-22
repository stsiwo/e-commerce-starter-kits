package com.iwaodev.application.event.review;

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
import com.iwaodev.domain.order.event.PaymentSucceededEvent;
import com.iwaodev.domain.review.event.ReviewWasUpdatedByMemberEvent;
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
import com.iwaodev.infrastructure.model.Review;
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
public class SendReviewWasUpdatedEmailEventHandler {

  private static final Logger logger = LoggerFactory.getLogger(SendReviewWasUpdatedEmailEventHandler.class);

  @Autowired
  private EmailService emailService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private SpringTemplateEngine thymeleafTemplateEngine;

  @Autowired
  private ClientSpaConfig clientSpaConfig;

  /**
   * send an email for review is updated successfully.
   *
   * include following: - greeting. - a list of items. - total price. (subtotal,
   * shipping cost, tax cost) - estimated delivery.
   **/
  @Async
  @TransactionalEventListener
  public void handleEvent(ReviewWasUpdatedByMemberEvent event) {
    logger.info("start SendNewOrderWasPlacedEmailEventHandler called.");
    logger.info(Thread.currentThread().getName());

    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "the admin user does not exist"));

    // Sender
    Company company = admin.getCompanies().get(0);
    String senderEmail = "no-reply@" + company.getDomain();

    // Recipient
    // admin and company email

    // review
    Review review = event.getReview();

    Map<String, Object> templateModel = new HashMap<String, Object>();

    logger.info("review user");
    logger.info(review.getUser().getFirstName());

    // set model variables
    templateModel.put("review", review);
    templateModel.put("admin", admin);
    templateModel.put("link",
        this.clientSpaConfig.getUrl() + "/admin/review?reviewId=" + review.getReviewId().toString());

    // prep variables for tmeplate html
    Context thymeleafContext = new Context();
    thymeleafContext.setVariables(templateModel);
    String htmlBody = thymeleafTemplateEngine.process("review-was-updated-email.html", thymeleafContext);

    logger.info(htmlBody);

    // send it
    try {
      this.emailService.send(admin.getEmail(), senderEmail,
          "A Review Was Updated By Customer (Review #: " + review.getReviewId() + ")", htmlBody);
    } catch (MessagingException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

  }
}
