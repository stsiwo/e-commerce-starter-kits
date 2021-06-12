package com.iwaodev.application.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iwaodev.application.dto.notification.NotificationDTO;
import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.iservice.NotificationService;
import com.iwaodev.application.mapper.NotificationMapper;
import com.iwaodev.infrastructure.model.Notification;

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
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

  private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

  @Autowired
  private NotificationRepository repository;

  @PersistenceContext
  private EntityManager entityManager;

  public Page<NotificationDTO> getAll(UUID userId, Integer page, Integer limit) {

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
  public NotificationDTO turnIsReadTrue(UUID userId, String id) {

    Notification notification = this.repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "the given address does not exist."));

    if (!notification.getRecipient().getUserId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cannot updte other's notification.");
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
  public void deleteIfRead() {

    List<Notification> removedNotificationList = this.repository.deleteAllByIsRead(true);

    logger.info("number of notification removed since there are already read: " + removedNotificationList.size());

  }
}
