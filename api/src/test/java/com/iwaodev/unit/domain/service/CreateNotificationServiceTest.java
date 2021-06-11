package com.iwaodev.unit.domain.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.service.CreateNotificationService;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.exception.DomainException;
import com.iwaodev.infrastructure.model.Notification;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlMergeMode;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@SpringBootTest
@ActiveProfiles("unittest")
@Sql(scripts = { "classpath:/unit/test-base.sql" })
@SqlMergeMode(SqlMergeMode.MergeMode.MERGE)
@Transactional  // this makes it possible to rollback after each test with @Sql
public class CreateNotificationServiceTest {

  private static final Logger logger = LoggerFactory.getLogger(CreateNotificationServiceTest.class);

  @Autowired
  private CreateNotificationService service;
  
  @Autowired
  private NotificationRepository repository;
  
  @Test
  //@Sql(scripts = { "classpath:/unit/domain/service/shouldCreateNewNotification.sql" })
  public void shouldCreateNewNotification() throws Exception {

    // arrange
    String dummyIssuerId = "e95bf632-1518-4bf2-8ba9-cd8b7587530b"; // test admin
    String dummyRecipientId = "c7081519-16e5-4f92-ac50-1834001f12b9"; // main test member
    
    // act
    Notification notification = this.service.create(
        NotificationTypeEnum.ORDER_STATUS_WAS_UPDATED_BY_ADMIN,
        "sample description",
        UUID.fromString(dummyIssuerId),
        UUID.fromString(dummyRecipientId),
        "sample-link",
        "sample-note"    
        );

    // assert
    assertThat(notification.getNotificationId()).isNotNull();
  }

  @Test
  //@Sql(scripts = { "classpath:/unit/domain/service/shouldCreateNewNotification.sql" })
  public void shouldNotCreateNewNotificationSinceIssuerAndRecipientTypeDoesNotMatch() throws Exception {

    // arrange
    String dummyIssuerId = "c7081519-16e5-4f92-ac50-1834001f12b9"; // main test member
    String dummyRecipientId = "e95bf632-1518-4bf2-8ba9-cd8b7587530b"; // test admin
    
    // act
    Notification notification = this.service.create(
        NotificationTypeEnum.ORDER_STATUS_WAS_UPDATED_BY_ADMIN, // issuer must be admin and recipient is member
        "sample description",
        UUID.fromString(dummyIssuerId),
        UUID.fromString(dummyRecipientId),
        "sample-link",
        "sample-note"    
        );

    Assertions.assertThrows(ResponseStatusException.class, () -> {
      this.repository.save(notification);
    });  
  }

  @Test
  @Sql(scripts = { "classpath:/unit/domain/service/shouldCreateBatchNotifications.sql" })
  public void shouldCreateBatchNotifications() throws Exception {

    // arrange
    String dummyRecipientId = "c7081519-16e5-4f92-ac50-1834001f12b9"; // main test member
    String dummyIssuerId = "e95bf632-1518-4bf2-8ba9-cd8b7587530b"; // test admin
    
    // act
    List<Notification> notificationList = this.service.createBatch(
        NotificationTypeEnum.NEW_PRODUCT_NOW_ON_SALE,
        "sample description",
        UUID.fromString(dummyRecipientId),
        UserTypeEnum.MEMBER,
        "sample-link",
        "sample-note"    
        );

    // assert
    assertThat(notificationList.size()).isGreaterThan(0);
    for (Notification notification : notificationList) {
      assertThat(notification.getNotificationId()).isNotNull();
      assertThat(notification.getIssuer().getUserId().toString()).isEqualTo(dummyRecipientId);
      assertThat(notification.getRecipient().getUserType().getUserType()).isEqualTo(UserTypeEnum.MEMBER);
    }
  }
}

