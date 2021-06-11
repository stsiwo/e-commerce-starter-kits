package com.iwaodev.application.irepository;

import java.util.List;

import com.iwaodev.infrastructure.model.Notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String>, JpaSpecificationExecutor<Notification>, AdvanceNotificationRepository {

  /**
   * - nativeQuery: use row SQL statement. (not JPQL)
   *
   * - don't return different entity rather than the main entity (e.g., Category)
   **/

  @Modifying
  @Query("delete from notifications n where n.isRead = ?1")
  List<Notification> deleteAllByIsRead(Boolean isRead);

}




