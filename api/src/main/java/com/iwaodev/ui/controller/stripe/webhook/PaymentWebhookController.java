package com.iwaodev.ui.controller.stripe.webhook;

import com.google.gson.JsonSyntaxException;
import com.iwaodev.infrastructure.payment.webhook.PaymentWebhookHandler;
import com.iwaodev.infrastructure.payment.webhook.PaymentWebhookHandlerFactory;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.iwaodev.exception.AppException;

/**
 *  Stripe Webhook Endpoint 
 *
 *    - security: verify a signature to check the request come from Stripe
 *
 *        - steps:
 *
 *          1. register the endpoint secret on Dashboard on Stripe (production) or run "stripe listen --forward-to localhost:8080/<WEBHOOK_ENDPOINT>" (development) to get endpoint secret
 *
 *          2. Stripe automatically set 'Stripe-Signature' header when it sends a request.
 *
 **/

@RestController
public class PaymentWebhookController {

  private static final Logger logger = LoggerFactory.getLogger(PaymentWebhookController.class);

  @Value("${stripe.webhook.endpoint.secret}")
  private String endpointSecret;

  private PaymentWebhookHandlerFactory paymentWebhookHandlerFactory;

  public PaymentWebhookController(PaymentWebhookHandlerFactory paymentWebhookHandlerFactory) {
    this.paymentWebhookHandlerFactory = paymentWebhookHandlerFactory;
  }

  /**
   * Stripe Webhook Endpoint
   *
   * desc) this is a main endpoint to accept all events from Stripe, and delegate this event to its corresponding event handler (e.g., infrastracture/payment/webhook/).
   *
   * prerequisite) you need to register an endpoint you want to listen at Stripe web console. (go to https://dashboard.stripe.com/webhooks).
   *
   * - Stripe Event: payment_intent_succeeded
   * (https://stripe.com/docs/api/payment_intents)
   *
   **/
  @PostMapping("/webhook/payment")
  @ResponseStatus(value = HttpStatus.OK)
  public void post(
      @RequestBody String payload,
      @RequestHeader("Stripe-Signature") String sigHeader
      ) throws Exception {

    logger.info("signature value : " + sigHeader);
    logger.info("endpoint secret value : " + endpointSecret);

    /**
     * validate request body (400 if failed) & verify the signature to check it came
     * from Stripe or not (400 if failed)
     **/

    // String payload = request.body();
    // String sigHeader = request.headers("Stripe-Signature");
    Event event = null;

    //  throw new AppException(HttpStatus.NOT_FOUND, "the given product does not exist.");
    try {
      event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
    } catch (JsonSyntaxException e) {
      throw new AppException(HttpStatus.BAD_REQUEST, "invalid payload");
    } catch (SignatureVerificationException e) {
      throw new AppException(HttpStatus.BAD_REQUEST, "invalid signature");
    }

    /**
     * deserialize the event object
     **/

    // Deserialize the nested object inside the event
    EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
    StripeObject stripeObject = null;
    if (dataObjectDeserializer.getObject().isPresent()) {
      stripeObject = dataObjectDeserializer.getObject().get();
    } else {
      // Deserialization failed, probably due to an API version mismatch.
      // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
      // instructions on how to handle this case, or return an error here.
    }

    logger.info("webhook test endpoint: event name = " + event.getType());

    /**
     * delegate this task to appropriate webhook handler
     **/
    PaymentWebhookHandler handler = this.paymentWebhookHandlerFactory.create(event);

    // null if there is not handler
    if (handler != null) {
      // otherwise, handle the webhook
      handler.handle(event, stripeObject);
    } else {
      logger.info("no handler is implemeneted for event type: " + event.getType());
    }
  }

}
