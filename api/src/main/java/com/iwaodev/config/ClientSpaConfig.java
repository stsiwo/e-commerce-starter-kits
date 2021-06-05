package com.iwaodev.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

// you still need @Configuration
@Configuration
@ConfigurationProperties(prefix = "spa")
// don't use @Value for immutable, it does not work with @ConfigurationProperties
@Data
public class ClientSpaConfig {

  private String url;

}


