package com.iwaodev.infrastructure.email;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import com.iwaodev.application.iservice.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

/**
 * ref: https://www.baeldung.com/spring-email-templates
 **/

@Component
public class EmailServiceImpl implements EmailService {

  @Autowired
  private JavaMailSender emailSender;

  @Override
  public void sendPaymentCompletedEmail() {

  }

  @Override
  public void send(String to, String from, String subject, String htmlBody) throws MessagingException {
    MimeMessage message = emailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    helper.setFrom(from);
    helper.setTo(to);
    helper.setSubject(subject);
    helper.setText(htmlBody, true);
    emailSender.send(message);
  }

}
