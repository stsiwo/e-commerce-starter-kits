package com.iwaodev.integration.event.review;

import java.util.Optional;
import java.util.UUID;

import com.iwaodev.application.event.review.SendPleaseReviewEmailEventHandler;
import com.iwaodev.application.event.review.SendReviewWasUpdatedEmailEventHandler;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.ReviewRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.review.event.ReviewWasUpdatedByMemberEvent;
import com.iwaodev.domain.user.event.GeneratedVerificationTokenEvent;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.Review;
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
public class SendReviewWasUpdatedEmailEventHandlerTest {

  private static final Logger logger = LoggerFactory.getLogger(SendReviewWasUpdatedEmailEventHandlerTest.class);

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
  private ReviewRepository reviewRepository;

  @Autowired
  private SendReviewWasUpdatedEmailEventHandler handler;

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
  @Sql(scripts = { "classpath:/integration/event/shouldSendReviewWasUpdatedEmail.sql" })
  public void shouldSendReviewWasUpdatedEmail() throws Exception {

    // make sure user_id in the sql match test admin user id

    // arrange
    Long dummyReviewId = 3L;
    Optional<Review> dummyReviewOption = this.reviewRepository.findById(dummyReviewId);
    Review dummyReview = dummyReviewOption.get();

    User recipient = this.userRepository.getAdmin().orElseThrow(() -> new Exception("admin not found."));

    // act & assert
    this.handler.handleEvent(new ReviewWasUpdatedByMemberEvent(this, dummyReview));

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    // assert
    Mockito.verify(this.emailService, Mockito.times(1))
      .send(
          Mockito.eq(recipient.getEmail()), 
          Mockito.anyString(), Mockito.any(),
          Mockito.eq(String.format("A Review Was Updated By Customer (Review #: %s)", dummyReview.getReviewId())), 
          Mockito.anyString());
  }
}







