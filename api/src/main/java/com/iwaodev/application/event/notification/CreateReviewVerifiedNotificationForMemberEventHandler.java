package com.iwaodev.application.event.notification;

import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.review.event.ReviewWasVerifiedByAdminEvent;
import com.iwaodev.domain.service.CreateNotificationService;
import com.iwaodev.exception.AppException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class CreateReviewVerifiedNotificationForMemberEventHandler {

  private static final Logger logger = LoggerFactory
      .getLogger(CreateReviewVerifiedNotificationForMemberEventHandler.class);

  @Autowired
  private CreateNotificationService createNotificationService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NotificationRepository notificationRepository;

  @Async
  @TransactionalEventListener()
  public void handleEvent(ReviewWasVerifiedByAdminEvent event) throws AppException {
    logger.info("start CreateReviewVerifiedNotificationForMemberEventHandler");
    logger.info(Thread.currentThread().getName());

    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));

    try {
      // member user
      Notification notification = this.createNotificationService.create(
          NotificationTypeEnum.REVIEW_WAS_VERIFIED_BY_ADMIN,
          String.format("Your review (review#: %s) for %s was verified. Thank you for your review.",
              event.getReview().getReviewId(), event.getReview().getProduct().getProductName()),
          admin, event.getReview().getUser(),
          String.format("/products/%s", event.getReview().getProduct().getProductPath()), "");

      this.notificationRepository.save(notification);
    } catch (NotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    }
  }
}
