package com.iwaodev.application.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.mail.MessagingException;

import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.ContactService;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.application.iservice.ReCaptchaService;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Company;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.contact.ContactCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

/**
 * ref: https://www.baeldung.com/spring-email-templates
 **/

@Service
@Transactional
public class ContactServiceImpl implements ContactService {

  private static final Logger logger = LoggerFactory.getLogger(ContactServiceImpl.class);

  @Autowired
  private EmailService emailService;

  @Autowired
  private SpringTemplateEngine thymeleafTemplateEngine;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ReCaptchaService recaptchaService;

  @Override
  public void submit(ContactCriteria criteria, UUID userId) throws Exception {

    Optional<User> adminRecipientOption = this.userRepository.getAdmin();

    // if not, return 404
    if (!adminRecipientOption.isPresent()) {
      logger.info("the admin user does not exist");
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "the admin user does not exist");
    }

    // verify recatcha token
    try {
      this.recaptchaService.verify(criteria.getRecaptchaToken());
    } catch (Exception e) {
      throw new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    User adminRecipient = adminRecipientOption.get();
    Company adminCompany = adminRecipient.getCompanies().get(0);
    String[] bcc = { adminRecipient.getEmail() };

    UserTypeEnum userType;
    User senderUser;
    if (userId == null) {
      userType = UserTypeEnum.ANONYMOUS;
      senderUser = null;
    } else {
      userType = UserTypeEnum.MEMBER;
      Optional<User> senderUserOption = this.userRepository.findById(userId);

      // if not, return 404
      if (!senderUserOption.isPresent()) {
        logger.info("the user does not exist");
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "the user does not exist");
      }
      senderUser = senderUserOption.get();
    }

    // prep variables for tmeplate html
    Map<String, Object> templateModel = new HashMap<String, Object>();
    templateModel.put("sender", criteria);
    templateModel.put("userType", userType);
    templateModel.put("user", senderUser);
    templateModel.put("recipient", adminRecipient);
    Context thymeleafContext = new Context();
    thymeleafContext.setVariables(templateModel);
    String htmlBody = thymeleafTemplateEngine.process("contact.html", thymeleafContext);

    try {
      this.emailService.send(adminCompany.getCompanyEmail(), criteria.getEmail(), bcc, criteria.getTitle(), htmlBody);
    } catch (MessagingException e) {
      logger.info(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "failed to send an email. please try again later.");
    }
  }


}
