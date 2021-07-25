package com.iwaodev.integration.event.notification;

// this is alias to SpringJUnit4ClassRunner
////@RunWith(SpringRunner.class)

import com.iwaodev.application.event.notification.CreateOrderEventNotificationEventHandler;
import com.iwaodev.application.event.notification.CreateReviewVerifiedNotificationForMemberEventHandler;
import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ReviewRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.review.event.ReviewWasVerifiedByAdminEvent;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.*;
import com.iwaodev.integration.event.order.RefundPaymentEventHandlerTest;
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
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

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
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional()
@ActiveProfiles("integtest")
@AutoConfigureMockMvc
public class CreateReviewVerifiedNotificationForMemberEventHandlerTest {

    private static final Logger logger = LoggerFactory.getLogger(RefundPaymentEventHandlerTest.class);

    @LocalServerPort
    private int port;

    @Autowired
    private BaseDatabaseSetup baseDatabaseSetup;

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CreateReviewVerifiedNotificationForMemberEventHandler handler;

    @Autowired
    private NotificationRepository notificationRepository;

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
    @Sql(scripts = { "classpath:/integration/event/shouldCreateReviewVerifiedNotificationByAdmin.sql" })
    public void shouldCreateReviewVerifiedNotificationByAdmin() throws Exception {

        // member only (no guest)

        // arrange
        Long dummyReviewId = 100L;
        Review dummyReview = this.reviewRepository.findById(dummyReviewId).orElseThrow(() -> new Exception("review not found. this should not happen."));
        User admin = this.userRepository.getAdmin().orElseThrow(() -> new RuntimeException("the admin not found. should not happen."));

        // act & assert
        this.handler.handleEvent(new ReviewWasVerifiedByAdminEvent(this, dummyReview));

        /**
         * NOTE: 'save' inside this handler automatically update/reflect target entity.
         *
         * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
         **/

        /// ntf type
        Map<NotificationTypeEnum, NotificationType> notificationTypeList = this.notificationRepository
                .getListOfNotificationTypes();
        NotificationType notificationTypeEntity = Optional.ofNullable(notificationTypeList.get(NotificationTypeEnum.REVIEW_WAS_VERIFIED_BY_ADMIN))
                .orElseThrow(() -> new NotFoundException("target notification type not found"));

        /// repo
        List<Notification> notifications = this.notificationRepository.findAll();
        Notification notification = notifications.get(0);

        // assert
        assertThat(notifications.size()).isEqualTo(1);
        assertThat(notification.getNotificationId()).isNotNull();
        assertThat(notification.getNotificationTitle()).isEqualTo(notificationTypeEntity.getNotificationTitleTemplate());
        assertThat(notification.getNotificationTitle()).isEqualTo(notificationTypeEntity.getNotificationTitleTemplate());
        assertThat(notification.getRecipient().getUserId()).isEqualTo(dummyReview.getUser().getUserId());
        assertThat(notification.getIssuer().getUserId()).isEqualTo(admin.getUserId());
        assertThat(notification.getLink()).isEqualTo(String.format("/products/%s", dummyReview.getProduct().getProductPath()));
    }

}
