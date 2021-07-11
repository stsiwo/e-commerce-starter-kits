package com.iwaodev.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.mockito.Mockito;

/**
 * bug: ApplicationEventPublisher with @MockBean does not create mocked ApplicationEventPublisher.
 *
 * workaournd: create this Testconfiguration class.
 *
 * ref: https://github.com/spring-projects/spring-framework/issues/18907
 *
 * usage: 
 *  1. add this annotation: @Import(MyTestConfiguration.class) at target test calss.
 *  2. add @MockBean with ApplicationEventPublisher
 *  3. use Mockito.verify to verify the event is published.
 *
 **/
@TestConfiguration
public class MyTestConfiguration {

  @Bean
  @Primary
  ApplicationEventPublisher publisher() {
    return Mockito.mock(ApplicationEventPublisher.class);
  }
}
