package com.iwaodev.infrastructure.payment.webhook;

import java.util.List;

import com.stripe.model.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PaymentWebhookHandlerFactoryImpl implements PaymentWebhookHandlerFactory {

  @Autowired
  private List<PaymentWebhookHandler> handlers;

	@Override
	public PaymentWebhookHandler create(Event event) {
    for (PaymentWebhookHandler handler : this.handlers) {
      if (handler.getType().equals(event.getType())) {
        return handler;
      }
    }
    return null;
	}
}
