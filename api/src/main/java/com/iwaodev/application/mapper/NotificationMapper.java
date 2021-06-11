package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.notification.NotificationDTO;
import com.iwaodev.infrastructure.model.Notification;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface NotificationMapper {

  NotificationMapper INSTANCE = Mappers.getMapper( NotificationMapper.class );

  @Mapping(target = "notificationType", source = "notificationType.notificationType")
  NotificationDTO toNotificationDTO(Notification notification);

}

