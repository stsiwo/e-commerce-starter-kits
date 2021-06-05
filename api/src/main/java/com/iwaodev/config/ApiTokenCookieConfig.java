package com.iwaodev.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;
import lombok.Getter;

// you still need @Configuration
@Configuration
@ConfigurationProperties(prefix = "cookie.api.token")
// don't use @Value for immutable, it does not work with @ConfigurationProperties
@Data
public class ApiTokenCookieConfig {

  private Integer timeout;

  private Boolean secure;

  private Boolean httpOnly;

  private String sameSite;

  private String domain;

  private String path;

}

