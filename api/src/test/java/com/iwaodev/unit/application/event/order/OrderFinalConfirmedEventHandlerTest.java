package com.iwaodev.unit.application.event.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.infrastructure.model.Order;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.ActiveProfiles;

//@SpringBootTest
//@ActiveProfiles("unittest")
//public class OrderFinalConfirmedEventHandlerTest {
//
//  private static final Logger logger = LoggerFactory.getLogger(OrderFinalConfirmedEventHandlerTest.class);
//
//  @Autowired
//  private ApplicationEventPublisher publisher;
//
//  @MockBean
//  private OrderRepository orderRepository;
//
//  @Test
//  public void shouldOrderFinalConfirmedEventHandlerCalledWhenOrderFinalConfirmedEventPublished() throws Exception {
//
//    // arrange
//    Order dummyOrder = new Order();
//    String dummyStripeCustomerId = "customer-id";
//
//    // act
//    logger.info("publisher exists");
//    logger.info("" + this.publisher);
//
//    /**
//     * got exception (NullPointerException).
//     *
//     * this is because there are multiple event listener registered for this event.
//     *
//     * need to think how to test event individually, or just jump into integration testing.
//     * 
//     * How about testing each event listener rather than raise this event.
//     *
//     **/
//
//    this.publisher.publishEvent(new OrderFinalConfirmedEvent(this, dummyOrder, dummyStripeCustomerId)); 
//
//    // assert
//    Mockito.verify(this.orderRepository, Mockito.times(1)).hashCode();
//    //assertThat(1).isEqualTo(1);
//  }
//
//}

