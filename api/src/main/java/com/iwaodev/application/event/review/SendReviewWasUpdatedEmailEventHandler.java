package com.iwaodev.application.event.review;

import java.util.HashMap;
import java.util.Map;

import javax.mail.MessagingException;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.config.ClientSpaConfig;
import com.iwaodev.domain.review.event.ReviewWasUpdatedByMemberEvent;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Company;
import com.iwaodev.infrastructure.model.Review;
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
public class SendReviewWasUpdatedEmailEventHandler implements EventHandler<ReviewWasUpdatedByMemberEvent>{

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
  public void handleEvent(ReviewWasUpdatedByMemberEvent event) throws AppException {
    logger.debug("start SendNewOrderWasPlacedEmailEventHandler called.");
    logger.debug(Thread.currentThread().getName());

    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "the admin user does not exist"));

    // Sender
    Company company = admin.getCompanies().get(0);
    String senderEmail = "no-reply@" + company.getDomain();
    String from = String.format("%s <%s>", company.getCompanyName(), senderEmail);
    String[] bcc = { admin.getEmail() };

    // Recipient
    // admin and company email

    // review
    Review review = event.getReview();

    Map<String, Object> templateModel = new HashMap<String, Object>();

    // set model variables
    templateModel.put("review", review);
    templateModel.put("admin", admin);
    templateModel.put("link",
        this.clientSpaConfig.getUrl() + "/admin/review?reviewId=" + review.getReviewId().toString());

    // prep variables for tmeplate html
    Context thymeleafContext = new Context();
    thymeleafContext.setVariables(templateModel);
    String htmlBody = thymeleafTemplateEngine.process("review-was-updated-email.html", thymeleafContext);

    // send it
    try {
      logger.debug(String.format("To: %s, From: %s", admin.getEmail(), senderEmail));
      this.emailService.send(admin.getEmail(), from, bcc,
          String.format("A Review Was Updated By Customer (Review #: %s)", review.getReviewId()), htmlBody);
    } catch (MessagingException e) {
      logger.debug(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

  }
}
