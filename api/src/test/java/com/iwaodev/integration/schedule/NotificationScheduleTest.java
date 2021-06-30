package com.iwaodev.integration.schedule;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

// MockMvc stuff
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.NotificationService;
import com.iwaodev.application.schedule.notification.NotificationSchedule;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.User;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.runner.RunWith;
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
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

// this is alias to SpringJUnit4ClassRunner
@RunWith(SpringRunner.class)
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
public class NotificationScheduleTest {

  private static final Logger logger = LoggerFactory.getLogger(NotificationScheduleTest.class);

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
  private NotificationRepository notificationRepository;

  @Autowired
  private NotificationService notificationService;

  @Autowired
  private NotificationSchedule task;

  /**
   * insert base test data into mysql database
   *
   * - such as user_types, test user
   *
   **/
  @BeforeTransaction
  void verifyInitialDatabaseState() throws Exception {
    logger.info("start calling setup before - satoshi");

    this.baseDatabaseSetup.setup(this.entityManager);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/schedule/shouldDistributeNewProductArrivedNotificationSuccessfully.sql" })
  public void shouldDistributeNewProductArrivedNotificationSuccessfully(/**
                                                                         * @Value("classpath:/integration/schedule/shouldAddSoldCountSuccessfullyWhenAddSoldCountEventHandlerCalled.json")
                                                                         * Resource dummyFormJsonFile
                                                                         **/
  ) throws Exception {

    // arrange
    // act & assert
    String dummyProductName1 = "Test Product Name That Should Be Long One For Testing Purpose.";
    String dummyProductName2 = "Test Product Name 2";


    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is
     * handled, its variant sold count is updated.
     **/

    /**
     * dont use this task handler directly since we dont' any control over the date
     * paramter from this test so use product service directly.
     **/
    // this.task.handle();
    // this.task.distributeNewProductArrivedNotification();
    this.notificationService.distributeNewProductArriveByTime(LocalDateTime.of(2021, 1, 1, 0, 0, 0));

    // assert
    List<User> users = this.userRepository.findAvailableAllByType(UserTypeEnum.MEMBER);


    for (User user : users) {
      List<String> targetNotifications = user.getReceivedNotifications().stream()
          .filter(notification -> notification.getNotificationType().getNotificationType()
              .equals(NotificationTypeEnum.NEW_PRODUCT_NOW_ON_SALE))
          .map(notification -> notification.getNotificationTitle()).collect(Collectors.toList());

      assertThat(targetNotifications.size()).isEqualTo(2);
      assertThat(targetNotifications.get(0)).isEqualTo(dummyProductName1);
      assertThat(targetNotifications.get(1)).isEqualTo(dummyProductName2);
    }

  }

}
