package com.iwaodev.unit.application.event.order;

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

