package com.iwaodev.integration.event.order;

import java.util.Optional;
import java.util.UUID;

import com.iwaodev.application.event.order.RefundPaymentEventHandler;
import com.iwaodev.application.event.order.SendCancelRequestSubmittedEmailEventHandler;
import com.iwaodev.application.event.review.SendPleaseReviewEmailEventHandler;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.application.iservice.PaymentService;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.event.OrderEventWasAddedByMemberEvent;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.user.event.GeneratedVerificationTokenEvent;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.User;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.transaction.annotation.Transactional;

/**
 * don't know how to test this.
 *
 * esp with Stripe. is there any way to create an record that payment is succeeded? 
 * as far as I know, we have to use js to do the payment.
 *
 * so for now, only test with mocked Stripe API.
 *
 **/

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
@Transactional()
@ActiveProfiles("integtest")
@AutoConfigureMockMvc
public class RefundPaymentEventHandlerTest {

  private static final Logger logger = LoggerFactory.getLogger(RefundPaymentEventHandlerTest.class);

  @LocalServerPort
  private int port;

  @Autowired
  private BaseDatabaseSetup baseDatabaseSetup;

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private RefundPaymentEventHandler handler;

  @MockBean
  private PaymentService paymentService;

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
  @Sql(scripts = { "classpath:/integration/event/shouldRefundPaymentSuccessfully.sql" })
  public void shouldRefundPaymentSuccessfully() throws Exception {

    /**
     * steps:
     *  1. prepare dummy order and the record in Stripe
     *    - need to send a request to the Stripe to create the record for dummy.
     *  2. send refund request with this event handler
     *  3. assert the result.
     **/

    // make sure user_id in the sql match test admin user id

    // arrange
    UUID dummyOrderId = UUID.fromString("c8f8591c-bb83-4fd1-a098-3fac8d40e450");
    Order dummyOrder = this.orderRepository.findById(dummyOrderId).orElseThrow(() -> new Exception("order not found. this should not happen."));

    // act & assert
    this.handler.handleEvent(new OrderEventWasAddedEvent(this, dummyOrder));

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    // assert
    Mockito.verify(this.paymentService, Mockito.times(1)).requestRefund(Mockito.anyString());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/event/shouldRefundPaymentSuccessfullySinceOrderEventStatusIsReturned.sql" })
  public void shouldRefundPaymentSuccessfullySinceOrderEventStatusIsReturned() throws Exception {

    /**
     * steps:
     *  1. prepare dummy order and the record in Stripe
     *    - need to send a request to the Stripe to create the record for dummy.
     *  2. send refund request with this event handler
     *  3. assert the result.
     **/

    // make sure user_id in the sql match test admin user id

    // arrange
    UUID dummyOrderId = UUID.fromString("c8f8591c-bb83-4fd1-a098-3fac8d40e450");
    Order dummyOrder = this.orderRepository.findById(dummyOrderId).orElseThrow(() -> new Exception("order not found. this should not happen."));

    // act & assert
    this.handler.handleEvent(new OrderEventWasAddedEvent(this, dummyOrder));

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    // assert
    Mockito.verify(this.paymentService, Mockito.times(1)).requestRefund(Mockito.anyString());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/event/shouldNotRefundPaymentSinceOrderEventIsNotCancelOrReturn.sql" })
  public void shouldNotRefundPaymentSinceOrderEventIsNotCancelOrReturn() throws Exception {

    /**
     * steps:
     *  1. prepare dummy order and the record in Stripe
     *    - need to send a request to the Stripe to create the record for dummy.
     *  2. send refund request with this event handler
     *  3. assert the result.
     **/

    // make sure user_id in the sql match test admin user id

    // arrange
    UUID dummyOrderId = UUID.fromString("c8f8591c-bb83-4fd1-a098-3fac8d40e450");
    Order dummyOrder = this.orderRepository.findById(dummyOrderId).orElseThrow(() -> new Exception("order not found. this should not happen."));

    // act & assert
    this.handler.handleEvent(new OrderEventWasAddedEvent(this, dummyOrder));

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    // assert
    Mockito.verify(this.paymentService, Mockito.never()).requestRefund(Mockito.anyString());
  }
}








