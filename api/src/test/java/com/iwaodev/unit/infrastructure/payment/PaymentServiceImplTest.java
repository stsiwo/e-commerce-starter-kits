package com.iwaodev.unit.infrastructure.payment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;

import com.iwaodev.application.iservice.PaymentService;
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
public class PaymentServiceImplTest {

  private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImplTest.class);

  @Autowired
  private PaymentService paymentService;

  @Value("${test.stripe.customer.id}")
  private String testStripeCustomerId;

  @Test
  public void shouldReturnPaymentIntentSuccessfullyWhenRequestWithoutCustomer() throws Exception {

    // arrange
    String firstName = "Satoshi";
    String lastName = "Iwao";
    String email = "test@email.com";
    String phone = "1234212342";
    OrderAddressCriteria shippingAddress = new OrderAddressCriteria();
    shippingAddress.setAddress1("address1");
    shippingAddress.setAddress2("address2");
    shippingAddress.setCity("city");
    shippingAddress.setProvince("province");
    shippingAddress.setCountry("country");
    shippingAddress.setPostalCode("postalcode");

    OrderAddressCriteria billingAddress = new OrderAddressCriteria();
    billingAddress.setAddress1("address1");
    billingAddress.setAddress2("address2");
    billingAddress.setCity("city");
    billingAddress.setProvince("province");
    billingAddress.setCountry("country");
    billingAddress.setPostalCode("postalcode");

    BigDecimal amount = new BigDecimal(100);

    // act
    PaymentIntent paymentIntent = this.paymentService.requestPaymentIntentWithoutCustomer(firstName, lastName, email,
        phone, shippingAddress, billingAddress, amount);

    // assert
    assertThat(paymentIntent.getId()).isNotNull();
    assertThat(paymentIntent.getClientSecret()).isNotNull();
  }

  @Test
  public void shouldReturnPaymentIntentSuccessfullyWhenRequestWithCustomer() throws Exception {

    // arrange
    BigDecimal amount = new BigDecimal(100);

    // act
    PaymentIntent paymentIntent = this.paymentService.requestPaymentIntentWithCustomer(this.testStripeCustomerId,
        amount);

    // assert
    assertThat(paymentIntent.getId()).isNotNull();
    assertThat(paymentIntent.getClientSecret()).isNotNull();
  }

  @Test
  public void shouldThrowExceptionWhenRequestWithCustomerWithInValidCustomerId() throws Exception {

    // arrange
    String invalidCustomerId = "cus_111133333";
    BigDecimal amount = new BigDecimal(100);

    // act
    assertThatThrownBy(() -> {
      PaymentIntent paymentIntent = this.paymentService.requestPaymentIntentWithCustomer(invalidCustomerId, amount);
    }).isInstanceOf(StripeException.class).isNotNull();

    // assert
  }

  /**
   * Stripe does not validate any input so you can create any duplicated user.
   *
   * make sure that this test create a test user in Stripe.
   *
   **/
  @Test
  public void shouldReturnCustomerSuccessfullyWhenCreateCustomer() throws Exception {

    // arrange
    String firstName = "Satoshi";
    String lastName = "Iwao";
    String email = "test@email.com";
    String phone = "1234212342";
    OrderAddressCriteria shippingAddress = new OrderAddressCriteria();
    shippingAddress.setAddress1("address1");
    shippingAddress.setAddress2("address2");
    shippingAddress.setCity("city");
    shippingAddress.setProvince("province");
    shippingAddress.setCountry("country");
    shippingAddress.setPostalCode("postalcode");

    OrderAddressCriteria billingAddress = new OrderAddressCriteria();
    billingAddress.setAddress1("address1");
    billingAddress.setAddress2("address2");
    billingAddress.setCity("city");
    billingAddress.setProvince("province");
    billingAddress.setCountry("country");
    billingAddress.setPostalCode("postalcode");

    String desc = "this is for testing so you can delete if you don't need this any more.";

    // act
    Customer customer = this.paymentService.createCustomer(firstName, lastName, email, phone, shippingAddress,
        billingAddress, desc);

    // assert
    assertThat(customer).isNotNull();
    assertThat(customer.getId()).isNotNull();
  }

}
