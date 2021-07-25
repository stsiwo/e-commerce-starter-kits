package com.iwaodev.infrastructure.payment.webhook;

import com.iwaodev.domain.order.event.PaymentSucceededEvent;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class PaymentIntentSucceeded implements PaymentWebhookHandler {

  private static final Logger logger = LoggerFactory.getLogger(PaymentIntentSucceeded.class);
  /**
   * better to create enum to avoid typo
   **/
  private final String type = "payment_intent.succeeded";

  @Autowired
  private ApplicationEventPublisher publisher;

	@Override
  @Transactional
    public void handle(Event event, StripeObject stripeObject) {
    /**
     * find target order by paymentIntentId and target customer by stripeCustomerId.
     *
     *  - stripe customer id could be null if guest user.
     *
     **/
    PaymentIntent paymentIntent = (PaymentIntent) stripeObject;

    String paymentIntentId = paymentIntent.getId();

    // customer if exists
    String stripeCustomerId = paymentIntent.getCustomer(); // assuming this is id

    // dispatch event
    this.publisher.publishEvent(new PaymentSucceededEvent(this, paymentIntentId, stripeCustomerId));

	}

  public String getType() {
    return this.type;
  }
}
