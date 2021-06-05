package com.iwaodev.unit.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.iwaodev.application.iservice.PaymentService;
import com.iwaodev.domain.order.OrderRule;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.exception.OutOfStockException;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.OrderEvent;
import com.iwaodev.infrastructure.model.Phone;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.order.OrderAddressCriteria;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("unittest")
public class UserTest {

  private static final Logger logger = LoggerFactory.getLogger(UserTest.class);

  @Test
  public void shouldToggleSelectionOnPhoneWhenTogglePhoneSelection() throws Exception {

    // arrange
    
    Long phone1Id = 1L;
    Long phone2Id = 2L;
    Long phone3Id = 3L;

    Phone phone1 = new Phone(phone1Id, "12341234", "+2", false);
    Phone phone2 = new Phone(phone2Id, "22342234", "+2", true);
    Phone phone3 = new Phone(phone3Id, "33343334", "+3", false);

    User dummyUser = new User("dummy", "dummy", "dummy@dummy.com", "dummy");
    dummyUser.addPhone(phone1);
    dummyUser.addPhone(phone2);
    dummyUser.addPhone(phone3);

    dummyUser.togglePhoneSelection(phone1Id);

    // act
    // assert
    for (Phone phone: dummyUser.getPhones()) {
      if (phone.getPhoneId().equals(phone1Id)) {
        assertThat(phone.getIsSelected()).isEqualTo(true);
      } else {
        assertThat(phone.getIsSelected()).isEqualTo(false);
      }
    }
  }
}
