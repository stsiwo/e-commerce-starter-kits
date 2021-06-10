package com.iwaodev.infrastructure.payment.webhook;

import com.iwaodev.domain.order.event.PaymentFailedEvent;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * better not to bring any internal logic here since it is hard to test with this stripe event.
 *
 * publish the event and delegate its task to the event handler, so make us easy to test.
 *
 **/

@Component
public class PaymentIntentPaymentFailed implements PaymentWebhookHandler {

  private static final Logger logger = LoggerFactory.getLogger(PaymentIntentPaymentFailed.class);
  /**
   * better to create enum to avoid typo
   **/
  private final String type = "payment_intent.payment_failed";

  @Autowired
  private ApplicationEventPublisher publisher;

  @Override
  @Transactional
  public void handle(Event event, StripeObject stripeObject) {
    logger.info("Stripe WebHook: " + this.type);
    logger.info("PaymentIntent has failed the attempt to create a payment method or a payment.");

    PaymentIntent paymentIntent = (PaymentIntent) stripeObject;

    String paymentIntentId = paymentIntent.getId();

    // customer if exists
    //String stripeCustomerId = paymentIntent.getCustomer(); // assuming this is id

    // dispatch event
    this.publisher.publishEvent(new PaymentFailedEvent(this, paymentIntentId));

  }

  public String getType() {
    return this.type;
  }
}
