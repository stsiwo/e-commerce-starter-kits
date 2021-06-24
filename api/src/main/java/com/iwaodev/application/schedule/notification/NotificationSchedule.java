package com.iwaodev.application.schedule.notification;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.service.CreateNotificationService;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.exception.AppException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.util.Util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationSchedule {

  private static final Logger logger = LoggerFactory.getLogger(NotificationSchedule.class);

  @Autowired
  private CreateNotificationService createNotificationService;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NotificationRepository notificationRepository;

  @Autowired
  private Util util;

  // every day at A.M. 0:00
  @Scheduled(cron = "0 0 0 ? * *") // check with this: https://www.freeformatter.com/cron-expression-generator-quartz.html
  public void distributeNewProductArrivedNotification() throws Exception {

    logger.info("start schedule: distributeNewProductArrivedNotification");

    // 1 get all products whose release date is today.
    List<Product> productList = this.productRepository.findAllNewProducts();
    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));

    List<Notification> notificationAllList = new ArrayList<>();
    // 2. create notifications to distribute to all member.
    for (Product product : productList) {

      try {

        List<Notification> notificationList = this.createNotificationService.createBatch(
            NotificationTypeEnum.NEW_PRODUCT_NOW_ON_SALE,
            String.format("A %s is now on sale! The price start from %s", product.getProductName(),
                util.currencyFormat(product.getCheapestPrice())),
            admin, UserTypeEnum.MEMBER, String.format("/products/%s", product.getProductPath()), "");
        notificationAllList = Stream.concat(notificationAllList.stream(), notificationList.stream())
            .collect(Collectors.toList());
      } catch (NotFoundException e) {
        throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
      }

    }

    this.notificationRepository.saveAll(notificationAllList);
  }
}
