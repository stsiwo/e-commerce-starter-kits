package com.iwaodev.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;

/**
 * nested config class.
 *
 * ref: https://stackoverflow.com/questions/29587640/spring-boot-nesting-configurationproperties/29588215
 *
 **/

//// you still need @Configuration
//@Configuration
//@ConfigurationProperties(prefix = "owner")
//// don't use @Value for immutable, it does not work with @ConfigurationProperties
//@Data
//public class OwnerConfig {
//
//  @Getter
//  private String fullName;
//
//  @Getter
//  private String email;
//
//  @Getter
//  private String phone;
//
//  @Getter
//  private Address phone;
//
//
//}
