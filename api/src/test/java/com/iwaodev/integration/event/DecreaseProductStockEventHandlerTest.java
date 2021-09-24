package com.iwaodev.integration.event;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

// MockMvc stuff

import com.iwaodev.application.event.product.DecreaseProductStockEventHandler;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderDetail;

import org.junit.jupiter.api.BeforeEach;
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
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import com.iwaodev.exception.AppException;
import org.springframework.transaction.support.TransactionTemplate;

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
public class DecreaseProductStockEventHandlerTest {

  private static final Logger logger = LoggerFactory.getLogger(DecreaseProductStockEventHandlerTest.class);

  @Autowired
  private PlatformTransactionManager transactionManager;

  private TransactionTemplate transactionTemplate;

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
  private DecreaseProductStockEventHandler handler;

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

  @BeforeEach
  void setUp() {
    transactionTemplate = new TransactionTemplate(transactionManager);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/event/shouldDecreaseProductStockSuccessfullyWhenDecreaseStockEventHandlerCalled.sql" })
  public void shouldDecreaseProductStockSuccessfullyWhenDecreaseStockEventHandlerCalled() throws Exception {

    // make sure user_id in the sql match test admin user id

    // arrange
    UUID dummyOrderId = UUID.fromString("c8f8591c-bb83-4fd1-a098-3fac8d40e450");
    Optional<Order> dummyOrderOption = this.orderRepository.findById(dummyOrderId);
    Order dummyOrder = dummyOrderOption.get();
    String dummyCustomerId = "dummy-customer-id";

    // assuming the number of order details: 3

    Integer[] originalStocks = { 
      dummyOrder.getOrderDetails().get(0).getProductVariant().getVariantStock(), 
      dummyOrder.getOrderDetails().get(1).getProductVariant().getVariantStock(), 
      dummyOrder.getOrderDetails().get(2).getProductVariant().getVariantStock() 
    };

    // act & assert
    this.handler.handleEvent(new OrderFinalConfirmedEvent(this, dummyOrder, dummyCustomerId, UserTypeEnum.MEMBER));

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    // assert
    // use prodictRepository to make sure purchased product has added sold count
    List<OrderDetail> orderDetails = dummyOrder.getOrderDetails();
    for (int i = 0; i < orderDetails.size(); i++) {
      Integer quantity = orderDetails.get(i).getProductQuantity(); 
      Integer stock = orderDetails.get(i).getProductVariant().getVariantStock();
      assertThat(originalStocks[i].intValue() - quantity.intValue()).isEqualTo(stock);
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/event/shouldThrowOutOfStockWhenDecreaseStockEventHandlerCalled.sql" })
  public void shouldThrowOutOfStockWhenDecreaseStockEventHandlerCalled() throws Exception {

    // make sure user_id in the sql match test admin user id

    // arrange
    UUID dummyOrderId = UUID.fromString("c8f8591c-bb83-4fd1-a098-3fac8d40e450");
    Optional<Order> dummyOrderOption = this.orderRepository.findById(dummyOrderId);
    Order dummyOrder = dummyOrderOption.get();
    String dummyCustomerId = "dummy-customer-id";

    // assuming the number of order details: 3

    // act & assert
    assertThatThrownBy(() -> {
      this.handler.handleEvent(new OrderFinalConfirmedEvent(this, dummyOrder, dummyCustomerId, UserTypeEnum.MEMBER));
    }).isInstanceOf(AppException.class);

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    // assert
    // use prodictRepository to make sure purchased product has added sold count
  }

  @Test
  @Sql(scripts = { "classpath:/integration/event/shouldThrowOptimisticLockExceptionWhenDecreaseStockEventHandlerCalled.sql" })
  public void shouldThrowOptimisticLockExceptionWhenDecreaseStockEventHandlerCalled() throws Exception {

    // make sure user_id in the sql match test admin user id

    // arrange
    UUID dummyOrder1Id = UUID.fromString("c8f8591c-bb83-4fd1-a098-3fac8d40e450");
    UUID dummyOrder2Id = UUID.fromString("56c2f133-90c7-47cd-81c4-db0478c4ed86");
    //Optional<Order> dummyOrder1Option = this.orderRepository.findById(dummyOrder1Id);
    //Optional<Order> dummyOrder2Option = this.orderRepository.findById(dummyOrder2Id);
    //Order dummyOrder1 = dummyOrder1Option.get();
    //Order dummyOrder2 = dummyOrder2Option.get();
    String dummyCustomerId = "dummy-customer-id";
    UUID[] orderIdList = {
            dummyOrder1Id,
            dummyOrder2Id
    };

    // assuming the number of order details: 3
    ExecutorService executorService = Executors.newFixedThreadPool(2);

    for (UUID id: orderIdList) {
      executorService.submit(() -> {
        transactionTemplate.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
        transactionTemplate.execute(status -> {
          logger.debug("current tx status: " + status.isNewTransaction());
          //Optional<Order> dummyOrderOption = this.orderRepository.findById(id);
          List<Order> orderList = this.orderRepository.findAll();
          logger.debug("after fetch");
          logger.debug("findAll size: " + orderList.size());
          //logger.debug("" + dummyOrderOption.isPresent());
          //Order dummyOrder = dummyOrderOption.get();
          //Order dummyOrder = null;
          logger.debug("tx done");
          //try {
          //  this.handler.handleEvent(new OrderFinalConfirmedEvent(this, dummyOrder, dummyCustomerId, UserTypeEnum.MEMBER));
          //} catch (Exception e) {
          //  logger.debug("exception");
          //  logger.debug(e.getMessage());
          //}
          return null;
        });
      });
    }
    executorService.shutdown();
    executorService.awaitTermination(5, TimeUnit.SECONDS);

    // act & assert

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    // assert
    // use prodictRepository to make sure purchased product has added sold count
  }
}




