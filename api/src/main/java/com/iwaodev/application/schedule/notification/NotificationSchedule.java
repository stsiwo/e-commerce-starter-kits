package com.iwaodev.application.schedule.notification;

import java.time.LocalDateTime;

import com.iwaodev.application.iservice.NotificationService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationSchedule {

  private static final Logger logger = LoggerFactory.getLogger(NotificationSchedule.class);

  @Autowired
  private NotificationService notificationService;

  // every day at A.M. 0:07
  // this should be called after "PublishNewProducts" schedule task (e.g., assuming the new products are is_public = true after that task.)
  @Scheduled(cron = "7 0 0 ? * *") // check with this: https://www.freeformatter.com/cron-expression-generator-quartz.html
  public void distributeNewProductArrivedNotification() throws Exception {

    logger.info("start schedule: distributeNewProductArrivedNotification");

    this.notificationService.distributeNewProductArriveByTime(LocalDateTime.now());

  }

  // every day at A.M. 0:00
  @Scheduled(cron = "0 0 0 ? * *") // check with this: https://www.freeformatter.com/cron-expression-generator-quartz.html
  public void deleteNotificationsIfRead() throws Exception {

    logger.info("start schedule: deleteNotificationsIfRead");

    this.notificationService.deleteIfRead();

  }
}
