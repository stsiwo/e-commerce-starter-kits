package com.iwaodev.application.event.user;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.mail.MessagingException;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.config.ClientSpaConfig;
import com.iwaodev.domain.user.event.GeneratedForgotPasswordTokenEvent;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Company;
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
public class SendForgotPasswordEmailEventHandler implements EventHandler<GeneratedForgotPasswordTokenEvent>{

  private static final Logger logger = LoggerFactory.getLogger(SendForgotPasswordEmailEventHandler.class);

  private EmailService emailService;

  private UserRepository userRepository;

  private SpringTemplateEngine thymeleafTemplateEngine;

  private ClientSpaConfig clientSpaConfig;

  @Autowired
  public SendForgotPasswordEmailEventHandler(UserRepository userRepository, EmailService emailService,
      SpringTemplateEngine thymeleafTemplateEngine, ClientSpaConfig clientSpaConfig) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.thymeleafTemplateEngine = thymeleafTemplateEngine;
    this.clientSpaConfig = clientSpaConfig;
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
  @Async
  @TransactionalEventListener
  public void handleEvent(GeneratedForgotPasswordTokenEvent event) throws AppException {

    logger.debug("start handleSendForgotPasswordEmailEventHandler");
    logger.debug(Thread.currentThread().getName());

    Optional<User> adminRecipientOption = this.userRepository.getAdmin();

    // if not, return 404
    if (!adminRecipientOption.isPresent()) {
      logger.debug("the admin user does not exist");
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "the admin user does not exist");
    }

    User adminRecipient = adminRecipientOption.get();
    Company adminCompany = adminRecipient.getCompanies().get(0);
    String senderEmail = "no-reply@" + adminCompany.getDomain();

    User recipientUser = event.getUser();

    String link = this.clientSpaConfig.getUrl() + "/reset-password?forgot-password-token="
        + recipientUser.getForgotPasswordToken();

    // prep variables for tmeplate html
    Map<String, Object> templateModel = new HashMap<String, Object>();
    templateModel.put("link", link);
    templateModel.put("recipient", recipientUser);
    Context thymeleafContext = new Context();
    thymeleafContext.setVariables(templateModel);
    String htmlBody = thymeleafTemplateEngine.process("forgot-password.html", thymeleafContext);

    logger.debug(htmlBody);

    // send it
    try {
      // TODO: make sure 'from' email address (check 'Design Issue: Email With Admin
      // Company State')
      logger.debug(String.format("To: %s, From: %s", recipientUser.getEmail(), senderEmail));
      this.emailService.send(recipientUser.getEmail(), senderEmail,
          "Forgot Password Email To Reset Your Password.", htmlBody);
    } catch (MessagingException e) {
      logger.debug(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "encountered errors during sending forgot-password email. please try again.");
    }

  }
}
