package com.iwaodev.application.event.notification;

import com.iwaodev.application.event.EventHandler;
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
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * create a notification for an review was submitted.
 *
 * 
 * don't forget implements EventHandler<E>. this is used for testing.
 *
 **/
@Service
public class CreateReviewNotificationForAdminEventHandler implements EventHandler<NewReviewWasSubmittedEvent> {

  private static final Logger logger = LoggerFactory.getLogger(CreateReviewNotificationForAdminEventHandler.class);

  @Autowired
  private CreateNotificationService createNotificationService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NotificationRepository notificationRepository;

  //@Async
  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(NewReviewWasSubmittedEvent event) throws AppException {
    logger.info("start CreateReviewEventNotificationEventHandler");
    logger.info(Thread.currentThread().getName());

    /**
     * when use @TransactionalEventListener with CrudRepository to persist data, this event handler must be under a transactional. Otherwise, it won't save it.
     *
     * you have two choices:
     *
     *  1. TransactionPhase.BEFORE_COMMIT
     *  2. @Transactional(propagation = Propagation.REQUIRES_NEW)
     *
     *  default (e.g., AFTER_COMMIT) won't work since the transaction is done already.
     *
     * ref: https://stackoverflow.com/questions/44752567/save-data-in-a-method-of-eventlistener-or-transactionaleventlistener
     */
    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));
    Notification notification;
    try {
      // member user
        notification = this.createNotificationService.create(
          NotificationTypeEnum.REVIEW_WAS_UPDATED_BY_MEMBER,
          String.format("A review (review#: %s) was submitted by %s. Please check the link for more detail.",
              event.getReview().getReviewId(), event.getReview().getUser().getFullName()),
          event.getReview().getUser(), admin,
          String.format("/admin/reviews?reviewId=%s", event.getReview().getReviewId()), "");


    } catch (NotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    }
    Notification savedEntity = this.notificationRepository.save(notification);
    logger.info("saved successfully (ntf id: " + notification.getNotificationId() + ")");
  }
}
