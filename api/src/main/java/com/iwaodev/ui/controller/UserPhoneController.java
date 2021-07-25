package com.iwaodev.ui.controller;

import java.util.List;
import java.util.UUID;

import javax.validation.Valid;

import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.application.iservice.UserPhoneService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.ui.criteria.user.UserPhoneCriteria;
import com.iwaodev.ui.response.BaseResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;


@RestController
public class UserPhoneController {

  private static final Logger logger = LoggerFactory.getLogger(UserPhoneController.class);

  @Autowired
  private UserPhoneService service;

  @GetMapping("/users/{userId}/phones")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<List<PhoneDTO>> get(
      @PathVariable(value = "userId") UUID userId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {
    return new ResponseEntity<>(this.service.getAll(userId), HttpStatus.OK);
  }

  // create a new phone of a given user
  @PostMapping("/users/{userId}/phones")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<PhoneDTO> post(
      @PathVariable(value = "userId") UUID userId,
      @AuthenticationPrincipal SpringSecurityUser authUser,
      @Valid @RequestBody UserPhoneCriteria criteria
      ) throws Exception {
    return new ResponseEntity<>(this.service.create(criteria, userId), HttpStatus.OK);
  }

  // replace an existing phone of a given user
  @PutMapping("/users/{userId}/phones/{phoneId}")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<PhoneDTO> put(
      @PathVariable(value = "userId") UUID userId,
      @PathVariable(value = "phoneId") Long phoneId,
      @AuthenticationPrincipal SpringSecurityUser authUser,
      @Valid @RequestBody UserPhoneCriteria criteria
      ) throws Exception {
    return new ResponseEntity<>(this.service.update(criteria, userId, phoneId), HttpStatus.OK);
  }
  
  // toggle isSelected on target phone 
  @PatchMapping("/users/{userId}/phones/{phoneId}")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<List<PhoneDTO>> patch(
      @PathVariable(value = "userId") UUID userId,
      @PathVariable(value = "phoneId") Long phoneId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {
    return new ResponseEntity<>(this.service.toggleSelection(userId, phoneId), HttpStatus.OK);
  }

  // replace an existing phone of a given user
  @DeleteMapping("/users/{userId}/phones/{phoneId}")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<BaseResponse> delete(
      @PathVariable(value = "userId") UUID userId,
      @PathVariable(value = "phoneId") Long phoneId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

    this.service.delete(userId, phoneId);

    return new ResponseEntity<>(new BaseResponse("successfuly deleted."), HttpStatus.OK);
  }
}

