package com.iwaodev.integration.event.payment;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;
import java.util.UUID;

// MockMvc stuff

import com.iwaodev.application.event.payment.PaymentSucceededEventHandler;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.PaymentSucceededEvent;
import com.iwaodev.infrastructure.model.Order;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

// this is alias to SpringJUnit4ClassRunner
////@RunWith(SpringRunner.class)
/**
 * this allows you to use TestEntityManager instead of EntityManager.
 *
 * - if you use Real EntityManager, transaction does not work correctly. esp
 * there is no rollback.
 *
 * - you can't use @DataJpaTest since this includes @BootstrapWith which is
 * included in @SpringBootTest too. this complains that multiple use
 * of @Bootstrap when compile
 * 
 **/
@AutoConfigureTestEntityManager
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
@ActiveProfiles("integtest")
@AutoConfigureMockMvc
public class GuestPaymentSucceededEventHandlerTest {

  private static final Logger logger = LoggerFactory.getLogger(GuestPaymentSucceededEventHandlerTest.class);

  @LocalServerPort
  private int port;

  @Autowired
  private BaseDatabaseSetup baseDatabaseSetup;

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private PaymentSucceededEventHandler handler;

  /**
   * insert base test data into mysql database
   *
   * - such as user_types, test user
   *
   **/
  @BeforeTransaction
  void verifyInitialDatabaseState() throws Exception {
    this.baseDatabaseSetup.setup(this.entityManager);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/event/shouldGuestHandlePaymentSucceededWhenPaymentSucceededEventHandlerCalled.sql" })
  public void shouldGuestHandlePaymentSucceededWhenPaymentSucceededEventHandlerCalled(/**@Value("classpath:/integration/event/shouldAddSoldCountSuccessfullyWhenAddSoldCountEventHandlerCalled.json") Resource dummyFormJsonFile**/) throws Exception {

    // make sure user_id in the sql match test admin user id

    // arrange
    UUID dummyOrderId = UUID.fromString("c8f8591c-bb83-4fd1-a098-3fac8d40e450");
    Optional<Order> dummyOrderOption = this.orderRepository.findById(dummyOrderId);
    Order dummyOrder = dummyOrderOption.get();
    String dummyPaymentIntentId = "sample_stripe_payment_intent_id";
    Integer[] expectedStockList = { 15, 7, 7 }; // check sql and add variant_stock + product_quantity!
    

    // act & assert
    this.handler.handleEvent(new PaymentSucceededEvent(this, dummyPaymentIntentId, null));

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    // assert
    // use prodictRepository to make sure purchased product has added sold count
    
    // check the order event (PAYMENT_SUCCEEDED) is added.
    dummyOrder.setUpCalculatedProperties();
    assertThat(dummyOrder.getOrderEvents().size()).isEqualTo(3);
    //assertThat(dummyOrder.getLatestOrderEventStatus()).isEqualTo(OrderStatusEnum.PAYMENT_SUCCEEDED); // @Formula is not updated, but it is ok since it is not returned to client.
    assertThat(dummyOrder.getLatestOrderEvent().getOrderStatus()).isEqualTo(OrderStatusEnum.PAID);

  }
}



