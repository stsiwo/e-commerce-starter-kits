package com.iwaodev.application.event.user;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.mail.MessagingException;

import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.config.ClientSpaConfig;
import com.iwaodev.domain.user.event.GeneratedForgotPasswordTokenEvent;
import com.iwaodev.domain.user.event.GeneratedVerificationTokenEvent;
import com.iwaodev.infrastructure.model.Company;
import com.iwaodev.infrastructure.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.server.ResponseStatusException;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

@Service
public class SendForgotPasswordEmailEventHandler implements ApplicationListener<GeneratedForgotPasswordTokenEvent> {

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

  @Override
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void onApplicationEvent(GeneratedForgotPasswordTokenEvent event) {

    logger.info("start handleSendForgotPasswordEmailEventHandler");
    logger.info(Thread.currentThread().getName());

    Optional<User> adminRecipientOption = this.userRepository.getAdmin();

    // if not, return 404
    if (adminRecipientOption.isEmpty()) {
      logger.info("the admin user does not exist");
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "the admin user does not exist");
    }

    User adminRecipient = adminRecipientOption.get();
    Company adminCompany = adminRecipient.getCompanies().get(0);

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

    logger.info(htmlBody);

    // send it
    try {
      // TODO: make sure 'from' email address (check 'Design Issue: Email With Admin
      // Company State')
      this.emailService.send(recipientUser.getEmail(), adminCompany.getCompanyEmail(),
          "Forgot Password Email To Reset Your Password.", htmlBody);
    } catch (MessagingException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

  }
}
