package com.iwaodev.infrastructure.payment;

import java.math.BigDecimal;

import com.iwaodev.application.iservice.PaymentService;
import com.iwaodev.infrastructure.model.OrderAddress;
import com.iwaodev.ui.criteria.order.OrderAddressCriteria;
import com.stripe.exception.StripeException;
import com.stripe.model.Address;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;

import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

  @Override
  public PaymentIntent requestPaymentIntentWithoutCustomer(String firstName, String lastName, String email,
      String phone, OrderAddressCriteria shippingAddress, OrderAddressCriteria billingAddress, BigDecimal amount)
      throws StripeException {

    PaymentIntentCreateParams.Shipping.Address customerShippingAddress = PaymentIntentCreateParams.Shipping.Address
        .builder().setLine1(shippingAddress.getAddress1()).setLine2(shippingAddress.getAddress2())
        .setCity(shippingAddress.getCity()).setState(shippingAddress.getProvince())
        .setCountry(shippingAddress.getCountry()).setPostalCode(shippingAddress.getPostalCode()).build();

    PaymentIntentCreateParams.Shipping customerShipping = PaymentIntentCreateParams.Shipping.builder()
        .setAddress(customerShippingAddress).setName(firstName + " " + lastName).setPhone(phone).build();

    /**
     * TODO: Don't we need to setup the guest customer information (e.g., firstname,
     * lastname, email) when payment without customer object??
     **/
    PaymentIntentCreateParams params = PaymentIntentCreateParams.builder().setAmount(amount.longValue())
        .setCurrency("cad").setReceiptEmail(email).setShipping(customerShipping)
        // .setSetupFutureUsage()
        .build();

    PaymentIntent paymentIntent = PaymentIntent.create(params);

    return paymentIntent;
  }

  @Override
  public PaymentIntent requestPaymentIntentWithCustomer(String stripeCustomerId, BigDecimal amount)
      throws StripeException {

    PaymentIntentCreateParams params = PaymentIntentCreateParams.builder().setAmount(amount.longValue())
        .setCurrency("cad").setCustomer(stripeCustomerId).build();

    PaymentIntent paymentIntent = PaymentIntent.create(params);

    return paymentIntent;
  }

  @Override
  public Customer createCustomer(String firstName, String lastName, String email, String phone,
      OrderAddressCriteria shippingAddress, OrderAddressCriteria billingAddress, String desc) throws StripeException {

    CustomerCreateParams.Address customerBillingAddress = CustomerCreateParams.Address.builder()
        .setLine1(billingAddress.getAddress1()).setLine2(billingAddress.getAddress2()).setCity(billingAddress.getCity())
        .setState(billingAddress.getProvince()).setCountry(billingAddress.getCountry())
        .setPostalCode(billingAddress.getPostalCode()).build();

    CustomerCreateParams.Shipping.Address customerShippingAddress = CustomerCreateParams.Shipping.Address.builder()
        .setLine1(shippingAddress.getAddress1()).setLine2(shippingAddress.getAddress2())
        .setCity(shippingAddress.getCity()).setState(shippingAddress.getProvince())
        .setCountry(shippingAddress.getCountry()).setPostalCode(shippingAddress.getPostalCode()).build();

    CustomerCreateParams.Shipping customerShipping = CustomerCreateParams.Shipping.builder()
        .setAddress(customerShippingAddress).setName(firstName + " " + lastName).setPhone(phone).build();

    CustomerCreateParams params = CustomerCreateParams.builder().setName(firstName + " " + lastName).setEmail(email)
        .setPhone(phone).setAddress(customerBillingAddress).setShipping(customerShipping).setDescription(desc).build();

    Customer customer = Customer.create(params);

    return customer;
  }

  @Override
  public void requestRefund(String paymentIntentId) throws StripeException {

    Refund refund = Refund.create(RefundCreateParams.builder().setPaymentIntent(paymentIntentId).build());

  }
}
