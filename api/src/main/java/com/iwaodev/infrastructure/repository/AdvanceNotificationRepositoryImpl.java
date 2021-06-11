package com.iwaodev.infrastructure.repository;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iwaodev.application.irepository.AdvanceNotificationRepository;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.NotificationType;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;


/**
 * any custom repository implementation must be registered with its target repository implementation name.
 *
 *
 * see note.md#CustomizedRepositoryImplementation more detail.
 *
 **/
@Component("notificationRepositoryImpl") // must be target repository implementation name
public class AdvanceNotificationRepositoryImpl implements AdvanceNotificationRepository {

  @PersistenceContext
  private EntityManager entityManager;

	@Override
	public Map<NotificationTypeEnum, NotificationType> getListOfNotificationTypes() {
    return this.entityManager.createQuery("SELECT nt FROM notificationTypes nt", NotificationType.class)
      .getResultStream()
      .collect(Collectors.toMap(
            notificationType -> ((NotificationTypeEnum) notificationType.getNotificationType()),
            notificationType -> ((NotificationType) notificationType)
          ));
	}
}
