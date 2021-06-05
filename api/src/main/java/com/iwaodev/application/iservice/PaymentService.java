package com.iwaodev.application.iservice;

import java.math.BigDecimal;

import com.iwaodev.ui.criteria.order.OrderAddressCriteria;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;

public interface PaymentService {

  /**
   * TODO: add 'set_future_payment' logic
   **/

  /**
   * return 'client_secret' (Stripe)
   *
   * - ref: https://stripe.com/docs/api/payment_intents/create
   **/
  public PaymentIntent requestPaymentIntentWithoutCustomer(String firstName, String lastName, String email, String phone,
      OrderAddressCriteria shippingAddress, OrderAddressCriteria billingAddress, BigDecimal amount) throws StripeException;

  public PaymentIntent requestPaymentIntentWithCustomer(String stripeCustomerId, BigDecimal amount) throws StripeException;

  /**
   * create a Customer object
   *
   * - ref:
   * https://www.javadoc.io/static/com.stripe/stripe-java/11.0.0/com/stripe/param/CustomerCreateParams.Builder.html
   *
   **/
  public Customer createCustomer(String firstName, String lastName, String email, String phone,
      OrderAddressCriteria shippingAddress, OrderAddressCriteria billingAddress, String desc) throws StripeException;

  /**
   * request a refund for a specific payment intent 
   *
   *  ref: https://stripe.com/docs/refunds
   **/
  public void requestRefund(String paymentIntentId) throws StripeException;


}
