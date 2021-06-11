package com.iwaodev.ui.controller;

import java.util.List;
import java.util.UUID;

import javax.validation.Valid;

import com.iwaodev.application.dto.notification.NotificationDTO;
import com.iwaodev.application.iservice.NotificationService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.ui.response.BaseResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


/**
 * implementation detail: https://github.com/stsiwo/feature-design/blob/main/notification-feature.png
 *
 **/
@RestController
public class UserNotificationController {

  private static final Logger logger = LoggerFactory.getLogger(UserNotificationController.class);

  @Autowired
  private NotificationService service;

  @GetMapping("/users/{userId}/notifications")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<Page<NotificationDTO>> get(
      @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
      @RequestParam(value = "limit", required = false, defaultValue = "5") Integer limit,
      //@RequestParam(value = "sort", required = false, defaultValue = "DATE_DESC") UserSortEnum sort,
      @PathVariable(value = "userId") UUID userId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) {
    logger.info("start handling a request at UserNotificationController#get");
    logger.info("user id: " + userId);

    return new ResponseEntity<>(this.service.getAll(userId, page, limit), HttpStatus.OK);
  }

  // turn 'is_read' true
  @PatchMapping("/users/{userId}/notifications/{notificationId}")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<NotificationDTO> patch(
      @PathVariable(value = "userId") UUID userId,
      @PathVariable(value = "notificationId") String notificationId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) {
    logger.info("start handling a request at UserNotificationController#post");
    logger.info("user id: " + userId);

    return new ResponseEntity<>(this.service.turnIsReadTrue(userId, notificationId), HttpStatus.OK);
  }
}


