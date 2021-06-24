package com.iwaodev.ui.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import com.iwaodev.application.dto.user.AddressDTO;
import com.iwaodev.application.iservice.UserAddressService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.ui.criteria.user.UserAddressCriteria;
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
import com.iwaodev.exception.AppException;


@RestController
public class UserAddressController {

  private static final Logger logger = LoggerFactory.getLogger(UserAddressController.class);

  @Autowired
  private UserAddressService service;

  @GetMapping("/users/{userId}/addresses")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<List<AddressDTO>> get(
      @PathVariable(value = "userId") UUID userId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {
    logger.info("start handling a request at UserAddressController#get");
    logger.info("user id: " + userId);

    return new ResponseEntity<>(this.service.getAll(userId), HttpStatus.OK);
  }

  // create a new address of a given user
  @PostMapping("/users/{userId}/addresses")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<AddressDTO> post(
      @PathVariable(value = "userId") UUID userId,
      @AuthenticationPrincipal SpringSecurityUser authUser,
      @Valid @RequestBody UserAddressCriteria criteria
      ) throws Exception {
    logger.info("start handling a request at UserAddressController#post");
    logger.info("user id: " + userId);
    logger.info("criteria" + criteria);

    return new ResponseEntity<>(this.service.create(criteria, userId), HttpStatus.OK);
  }

  // replace an existing address of a given user
  @PutMapping("/users/{userId}/addresses/{addressId}")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<AddressDTO> put(
      @PathVariable(value = "userId") UUID userId,
      @PathVariable(value = "addressId") Long addressId,
      @AuthenticationPrincipal SpringSecurityUser authUser,
      @Valid @RequestBody UserAddressCriteria criteria
      ) throws Exception {
    logger.info("start handling a request at UserAddressController#post");
    logger.info("user id: " + userId);
    logger.info("criteria" + criteria);

    return new ResponseEntity<>(this.service.update(criteria, userId, addressId), HttpStatus.OK);
  }
  
  // update isBillingAddress/isShippingAddress 
  @PatchMapping("/users/{userId}/addresses/{addressId}")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<List<AddressDTO>> patch(
      @PathVariable(value = "userId") UUID userId,
      @PathVariable(value = "addressId") Long addressId,
      @NotEmpty @RequestBody Map<String, String> body,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {
    logger.info("start handling a request at UserAddressController#post");
    logger.info("user id: " + userId);

    logger.info("type: " + body);

    if (body.get("type").equals("billing")) {
      return new ResponseEntity<>(this.service.toggleBillingAddress(userId, addressId), HttpStatus.OK);
    } else if (body.get("type").equals("shipping")) {
      return new ResponseEntity<>(this.service.toggleShippingAddress(userId, addressId), HttpStatus.OK);
    } else {
      logger.info("invalid request body. only allow to specify 'billing' or 'shipping'.");
      throw new AppException(HttpStatus.BAD_REQUEST, "invalid request body. only allow to specify 'billing' or 'shipping'.");
    }

  }

  // replace an existing address of a given user
  @DeleteMapping("/users/{userId}/addresses/{addressId}")
  // make sure 'authUser' is passed to parameters and 'userId' must match with '#userId' at @PreAuthorize value
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") // to prevent a member from accessing another
  public ResponseEntity<BaseResponse> delete(
      @PathVariable(value = "userId") UUID userId,
      @PathVariable(value = "addressId") Long addressId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

    logger.info("user id: " + userId);
    logger.info("address id: " + addressId);

    this.service.delete(userId, addressId);

    return new ResponseEntity<>(new BaseResponse("successfuly deleted."), HttpStatus.OK);
  }
}

