package com.iwaodev.integration.event;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;
import java.util.UUID;

// MockMvc stuff

import com.iwaodev.application.event.user.SendVerificationEmailEventHandler;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.user.event.GeneratedVerificationTokenEvent;
import com.iwaodev.infrastructure.model.User;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
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
public class SendVerificationEmailEventHandlerTest {

  private static final Logger logger = LoggerFactory.getLogger(SendVerificationEmailEventHandlerTest.class);

  @LocalServerPort
  private int port;

  @Autowired
  private BaseDatabaseSetup baseDatabaseSetup;

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private SendVerificationEmailEventHandler handler;

  @MockBean
  private EmailService emailService;

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
  //@Sql(scripts = { "classpath:/integration/event/shouldSendVerificationTokenEmailSuccessfullyWhenSendVerificationTokenEventHandlerCalled.sql" })
  public void shouldSendVerificationTokenEmailSuccessfullyWhenSendVerificationTokenEventHandlerCalled() throws Exception {

    // make sure user_id in the sql match test admin user id

    // arrange
    UUID dummyUserId = UUID.fromString("c7081519-16e5-4f92-ac50-1834001f12b9");
    Optional<User> dummyUserOption = this.userRepository.findById(dummyUserId);
    User dummyUser = dummyUserOption.get();

    // act & assert
    this.handler.handleEvent(new GeneratedVerificationTokenEvent(this, dummyUser));

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    // assert
    Mockito.verify(this.emailService, Mockito.times(1)).send(Mockito.eq(dummyUser.getEmail()), Mockito.anyString(), Mockito.eq("Verification Email To Activate Your Account."), Mockito.anyString());
  }
}





