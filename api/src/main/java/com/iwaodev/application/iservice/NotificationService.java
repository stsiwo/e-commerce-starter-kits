package com.iwaodev.application.iservice;

import java.util.UUID;

import com.iwaodev.application.dto.notification.NotificationDTO;

import org.springframework.data.domain.Page;

public interface NotificationService {

  public Page<NotificationDTO> getAll(UUID userId, Integer page, Integer limit) throws Exception;

  public NotificationDTO turnIsReadTrue(UUID userId, String notificationId) throws Exception;

  public void deleteIfRead() throws Exception; 
}




