package com.iwaodev.infrastructure.payment.webhook;

import com.stripe.model.Event;
import com.stripe.model.StripeObject;

public interface PaymentWebhookHandler {

  public void handle(Event event, StripeObject stripeObject);

  public String getType();
}

