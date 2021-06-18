package com.iwaodev.application.iservice;

import javax.mail.MessagingException;

public interface EmailService {

  public void sendPaymentCompletedEmail();

  public void send(String to, String from, String subject, String htmlBody) throws MessagingException;

  public void send(String to, String from, String[] bcc, String subject, String htmlBody) throws MessagingException;
}
