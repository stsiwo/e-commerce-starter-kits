package com.iwaodev.integration.schedule;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
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
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.NotificationType;
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

    /**
     * bug?: 'user.getReceivedNotification()' does not fetch the notitifcaitons.
     * - you need to fetch it with 'this.notificationRepository.findAll()' first.
     **/
    List<Notification> totalNotifications = this.notificationRepository.findAll();
    logger.info("total notification size: " + totalNotifications.size());

    // get list of notifcationTypes
    Map<NotificationTypeEnum, NotificationType> notificationTypeList = this.notificationRepository
        .getListOfNotificationTypes();

    // find target notification type entity
    NotificationType notificationTypeEntity = Optional.ofNullable(notificationTypeList.get(NotificationTypeEnum.NEW_PRODUCT_NOW_ON_SALE))
        .orElseThrow(() -> new NotFoundException("target notification type not found"));

    assertThat(users.size()).isEqualTo(3); // including main test member
    for (User user : users) {
      List<Notification> notifications = user.getReceivedNotifications();
      logger.info("notification size: " + notifications.size());
      List<String> targetNotifications = user.getReceivedNotifications().stream()
          .filter(notification -> notification.getNotificationType().getNotificationType()
              .equals(NotificationTypeEnum.NEW_PRODUCT_NOW_ON_SALE))
          .map(notification -> notification.getNotificationTitle()).collect(Collectors.toList());

      assertThat(targetNotifications.size()).isEqualTo(1);
      assertThat(targetNotifications.get(0)).isEqualTo(notificationTypeEntity.getNotificationTitleTemplate());
    }

  }

  @Test
  @Sql(scripts = { "classpath:/integration/schedule/shouldDeleteReadNotifications.sql" })
  public void shouldDeleteReadNotifications() throws Exception {

    // arrange
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
    this.notificationService.deleteIfRead();

    // assert
    List<Notification> notifications = this.notificationRepository.findAll();
    for (Notification notification: notifications) {
      logger.info("notification id : " +  notification.getNotificationId());
      assertThat(notification.getIsRead()).isFalse();
    }

    // association assert
    // - user (exist)
    Boolean isIssuerExist = this.entityManager.getEntityManager().createQuery(
        "select case when (count(u) > 0)  then true else false end from users u where u.userId = :userId",
        Boolean.class).setParameter("userId", UUID.fromString("e95bf632-1518-4bf2-8ba9-cd8b7587530b")).getSingleResult();
    Boolean isRecipientExist = this.entityManager.getEntityManager().createQuery(
        "select case when (count(u) > 0)  then true else false end from users u where u.userId = :userId",
        Boolean.class).setParameter("userId", UUID.fromString("c7081519-16e5-4f92-ac50-1834001f12b9")).getSingleResult();

    assertThat(isIssuerExist).isTrue();
    assertThat(isRecipientExist).isTrue();
  }
}
