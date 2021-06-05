package com.iwaodev.infrastructure.payment.webhook;

import com.stripe.model.Event;

public interface PaymentWebhookHandlerFactory {

  public PaymentWebhookHandler create(Event event);
}
