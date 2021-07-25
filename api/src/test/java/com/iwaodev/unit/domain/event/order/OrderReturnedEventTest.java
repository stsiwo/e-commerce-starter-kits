package com.iwaodev.unit.domain.event.order;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.Set;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.event.notification.CreateOrderEventNotificationEventHandler;
import com.iwaodev.application.event.order.RefundPaymentEventHandler;
import com.iwaodev.application.event.order.SendCancelRequestWasConfirmedEmailEventHandler;
import com.iwaodev.application.event.order.SendOrderWasCanceledEmailEventHandler;
import com.iwaodev.application.event.order.SendOrderWasReturnedEmailEventHandler;
import com.iwaodev.application.event.order.SendOrderWasShippedEmailEventHandler;
import com.iwaodev.application.event.order.SendReturnRequestWasConfirmedEmailEventHandler;
import com.iwaodev.application.event.product.AddSoldCountEventHandler;
import com.iwaodev.application.event.review.SendPleaseReviewEmailEventHandler;
import com.iwaodev.domain.order.event.CompletedOrderPaymentEvent;
import com.iwaodev.domain.order.event.OrderCanceledEvent;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.order.event.OrderReturnedEvent;
import com.iwaodev.util.TestUtil;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * check if registered event handler is called or not.
 *
 * if you miss mocked one of event handler, it called the real one. be careful.
 *
 *
 * note:
 *
 * Testing with @TransactionalEventListener.
 *
 * you need to have a transaction in order the event handler to be called.
 *
 * 1. add @EnableTransactionManagement and @Transactional at this class.
 *
 * 2. add @Commit (even before commited @TransactionalEventListener(phase =
 * TransactionPhase.BEFORE_COMMIT).
 *
 * this is the condition to make ApplicationEventPublisher.publishEvent works.
 * Otherwise, all event handlers are not called at test env.
 *
 * * important note: since this use @Commit annotation which causes to persist
 * any test data so don't use any test data with sql.
 *
 * issue:
 *
 * - I don't know how to mock/spy the @TransactionalEventHandler method.
 * 
 * - if you use MockBean, the event handler is never called.
 *
 * - if you use SpyBean, the event handler is called, but the method (e.g.,
 * handleEvent) cannot replaced with mocked one with 'doNothing().when(...)'
 *
 * - for now, create a autowired dependency to every event handler then make
 * sure the dependency is called with MockBean. what the fuck!!
 *
 * - the dependency is called EventHandlerChecker and this is called inside
 * AspectJ so don't forget annotate it
 * (com.iwaodev.com.annotation.EventHandlerCheck) for each event handler.
 *
 * - this also does not work because of @Commit.
 *
 * - when use @Commit, all Mockito mock/spy bean and 'verify' method does not
 * work. i don't know why.!!
 *
 * - need to take another approach.
 *
 * - the idea is that get all event handlers of specific event with reflections and compare it.
 *
 **/
//@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("unittest")
// @EnableTransactionManagement
// @Transactional(propagation = Propagation.REQUIRES_NEW)
public class OrderReturnedEventTest {

  private static final Logger logger = LoggerFactory.getLogger(OrderReturnedEventTest.class);

  @Autowired
  private TestUtil testUtil;

  // @Test
  // @Commit
  // public void shouldAllEventHandlersCalled() throws Exception {

  // // arrange
  // Order dummyOrder = new Order();
  // OrderEventWasAddedEvent event = new OrderEventWasAddedEvent(this,
  // dummyOrder);

  // //Mockito.doNothing().when(this.refundPaymentEventHandler).handleEvent(event);
  // //Mockito.when(this.eventHandlerChecker.check(Mockito.anyString())).thenReturn("A");

  // // act
  // this.publisher.publishEvent(event);

  // // assert
  // Mockito.verify(this.refundPaymentEventHandler,
  // Mockito.times(1)).handleEvent(event);
  // //assertThat(1).isEqualTo(1);
  // //Mockito.verify(this.refundPaymentEventHandler,
  // Mockito.times(1)).handleEvent(event);
  // //Mockito.verify(this.sendOrderWasShippedEmailEventHandler,
  // Mockito.times(1)).handleEvent(event);
  // //Mockito.verify(this.sendPleaseReviewEmailEventHandler,
  // Mockito.times(1)).handleEvent(event);
  // //Mockito.verify(this.createOrderEventNotificationEventHandler,
  // Mockito.times(1)).handleEvent(event);
  // //Mockito.verify(this.sendCancelRequestWasConfirmedEmailEventHandler,
  // Mockito.times(1)).handleEvent(event);
  // //Mockito.verify(this.sendOrderWasReturnedEmailEventHandler,
  // Mockito.times(1)).handleEvent(event);
  // //Mockito.verify(this.sendOrderWasCanceledEmailEventHandler,
  // Mockito.times(1)).handleEvent(event);
  // //Mockito.verify(this.sendReturnRequestWasConfirmedEmailEventHandler,
  // Mockito.times(1)).handleEvent(event);
  // }

  @Test
  public void shouldAllEventHandlersCalled() throws Exception {

    // arrange
    Set<Class> registeredEventHandlers = new HashSet<>();

    Set<Class<? extends EventHandler>> result = this.testUtil.getAllEventHandlerOfEvent(OrderReturnedEvent.class);

    assertThat(registeredEventHandlers.size()).isEqualTo(result.size());
    assertThat(registeredEventHandlers.containsAll(result) && result.containsAll(registeredEventHandlers)).isTrue();
  }
}
