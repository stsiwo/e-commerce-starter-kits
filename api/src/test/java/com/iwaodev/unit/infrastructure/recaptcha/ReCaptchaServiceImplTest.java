package com.iwaodev.unit.infrastructure.recaptcha;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.iwaodev.application.iservice.ReCaptchaService;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("unittest")
public class ReCaptchaServiceImplTest {

  private static final Logger logger = LoggerFactory.getLogger(ReCaptchaServiceImplTest.class);

  @Autowired
  private ReCaptchaService recaptchaService;

  /**
   * no way to test when verification succeeded since no front end involved.
   *
   * to test this, make sure the exception is thrown with invalid secret.
   *
   **/

  @Test
  public void shouldReturnPaymentIntentSuccessfullyWhenRequestWithoutCustomer() throws Exception {

    // arrange
    String dummyRecaptchToken = "token";
    // act
    // assert
    assertThatThrownBy(() -> {
      this.recaptchaService.verify(dummyRecaptchToken);
    }).isInstanceOf(Exception.class);
  }
}

