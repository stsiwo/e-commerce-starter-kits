package com.iwaodev.application.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iwaodev.application.dto.notification.NotificationDTO;
import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.NotificationService;
import com.iwaodev.application.mapper.NotificationMapper;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.service.CreateNotificationService;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.exception.AppException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.util.Util;

import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

  private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

  @Autowired
  private NotificationRepository repository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private CreateNotificationService createNotificationService;

  @Autowired
  private Util util;

  @PersistenceContext
  private EntityManager entityManager;

  public Page<NotificationDTO> getAll(UUID userId, Integer page, Integer limit) throws Exception {

    // session filter (e.g., @Filter/@FilterDef) - reviews entity
    Session session = this.entityManager.unwrap(Session.class);
    session.enableFilter("recipientIdFilter").setParameter("recipientId", userId.toString());
    session.enableFilter("isReadFilter").setParameter("isRead", false);

    // get result with repository
    // and map entity to dto with MapStruct
    return this.repository.findAll(PageRequest.of(page, limit, getSort()))
        .map(new Function<Notification, NotificationDTO>() {

          @Override
          public NotificationDTO apply(Notification notification) {
            return NotificationMapper.INSTANCE.toNotificationDTO(notification);
          }
        });

  }

  private Sort getSort() {
    return Sort.by("createdAt").descending();
  }

  @Override
  public NotificationDTO turnIsReadTrue(UUID userId, String id) throws Exception {

    Notification notification = this.repository.findById(id)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given address does not exist."));

    if (!notification.getRecipient().getUserId().equals(userId)) {
      throw new AppException(HttpStatus.BAD_REQUEST, "cannot updte other's notification.");
    }

    notification.turnReadTrue();

    // save it
    Notification savedNotification = this.repository.save(notification);

    // map entity to dto and return it.
    return NotificationMapper.INSTANCE.toNotificationDTO(savedNotification);
  }

  /**
   * remove all notification if it is read.
   *
   * this is used by scheduling tasks.
   **/
  @Override
  public void deleteIfRead() throws Exception {

    this.repository.deleteAllByIsRead(true);

    //logger.info("number of notification removed since there are already read: " + removedNotificationList.size());

  }

  @Override
  public void distributeNewProductArriveByTime(LocalDateTime time) throws Exception {

    logger.info("" + time);
    
    // 1 get all products whose release date is today.
    // this products are isPublic true and release date is the given time.
    List<Product> productList = this.productRepository.getAllNewProductByTime(time);
    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new AppException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));

    logger.info("new product size: " + productList.size());

    List<Notification> notificationAllList = new ArrayList<>();
    // 2. create notifications to distribute to all member.
    for (Product product : productList) {
      logger.info("product id: " + product.getProductId());
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

    logger.info("notification size for new product release: " + notificationAllList.size());

    this.repository.saveAll(notificationAllList);
  }
}
