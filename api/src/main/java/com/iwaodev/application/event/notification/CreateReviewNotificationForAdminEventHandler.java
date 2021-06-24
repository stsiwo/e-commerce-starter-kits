package com.iwaodev.application.event.notification;

import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.review.event.NewReviewWasSubmittedEvent;
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
public class CreateReviewNotificationForAdminEventHandler {

  private static final Logger logger = LoggerFactory.getLogger(CreateReviewNotificationForAdminEventHandler.class);

  @Autowired
  private CreateNotificationService createNotificationService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NotificationRepository notificationRepository;

  @Async
  @TransactionalEventListener()
  public void handleEvent(NewReviewWasSubmittedEvent event) throws AppException {
    logger.info("start CreateReviewEventNotificationEventHandler");
    logger.info(Thread.currentThread().getName());

    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));

    try {
      // member user
      Notification notification = this.createNotificationService.create(
          NotificationTypeEnum.REVIEW_WAS_UPDATED_BY_MEMBER,
          String.format("A new review (review#: %s) was submitted by %s. Please check the link for more detail.",
              event.getReview().getReviewId(), event.getReview().getUser().getFullName()),
          event.getReview().getUser(), admin,
          String.format("/admin/reviews?reviewId=%s", event.getReview().getReviewId()), "");

      this.notificationRepository.save(notification);
    } catch (NotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    }
  }
}
