package com.iwaodev.integration.event.user;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;
import java.util.UUID;

// MockMvc stuff

import com.iwaodev.application.event.user.AssignStripeCustomerIdEventHandler;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.User;

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
public class AssignStripeCustomerIdEventHandlerTest {

  private static final Logger logger = LoggerFactory.getLogger(AssignStripeCustomerIdEventHandlerTest.class);

  @LocalServerPort
  private int port;

  @Autowired
  private BaseDatabaseSetup baseDatabaseSetup;

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private AssignStripeCustomerIdEventHandler handler;

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
  //@Sql(scripts = { "classpath:/integration/event/user/shouldAssignStripeCustomerIdWhenEventHandlerCalled.sql" })
  public void shouldMemberAssignStripeCustomerIdWhenEventHandlerCalled(/**@Value("classpath:/integration/event/shouldAddSoldCountSuccessfullyWhenAddSoldCountEventHandlerCalled.json") Resource dummyFormJsonFile**/) throws Exception {

    // make sure user_id in the sql match test admin user id

    // arrange
    UUID dummyUserId = UUID.fromString("c7081519-16e5-4f92-ac50-1834001f12b9");
    Optional<User> dummyUserOption = this.userRepository.findById(dummyUserId);
    User dummyUser = dummyUserOption.get();

    Order dummyOrder = new Order();
    dummyOrder.setUser(dummyUser);

    String dummyStripeCustomerId = "dummy stripe customer id";

    // act & assert
    this.handler.handleEvent(new OrderFinalConfirmedEvent(this, dummyOrder, dummyStripeCustomerId, UserTypeEnum.MEMBER));

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    // assert
    assertThat(dummyUser.getStripeCustomerId()).isEqualTo(dummyStripeCustomerId);
  }

  /**
   * how to assert this?
   *
   * assert 'userRepository.save' is not called. but it requires me to use @Mock repository. 
   *
   **/
  @Test
  //@Sql(scripts = { "classpath:/integration/event/user/shouldAssignStripeCustomerIdWhenEventHandlerCalled.sql" })
  public void shouldNotAnonymousAssignStripeCustomerIdWhenEventHandlerCalled(/**@Value("classpath:/integration/event/shouldAddSoldCountSuccessfullyWhenAddSoldCountEventHandlerCalled.json") Resource dummyFormJsonFile**/) throws Exception {

    // make sure user_id in the sql match test admin user id

    // arrange
    Order dummyOrder = new Order();

    String dummyStripeCustomerId = "dummy stripe customer id";

    // act & assert
    this.handler.handleEvent(new OrderFinalConfirmedEvent(this, dummyOrder, dummyStripeCustomerId, UserTypeEnum.ANONYMOUS));

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    // assert
    // check there is no exception since if userId does not exist, it will throw the exception.
    // so, assertion could be anything.
    // we want to make sure that no exception is thrown during the subject.
    assertThat(1).isEqualTo(1);
  }
}



