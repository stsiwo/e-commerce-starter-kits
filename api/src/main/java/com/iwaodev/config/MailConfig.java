package com.iwaodev.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

// you still need @Configuration
@Configuration
@ConfigurationProperties(prefix = "spring.mail")
// don't use @Value for immutable, it does not work with @ConfigurationProperties
@Data
public class MailConfig {

  private String host;

  private Integer port;

  private String userName;

  private String password;

  @Value("${spring.mail.properties.mail.smtp.auth}")
  private Boolean isSmtpAuth;

  @Value("${spring.mail.properties.mail.starttls.enable}")
  private Boolean isStartTlsEnable;
}


