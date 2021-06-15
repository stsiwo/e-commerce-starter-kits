package com.iwaodev.ui.controller;

import javax.validation.Valid;

import com.iwaodev.application.iservice.ContactService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.ui.criteria.contact.ContactCriteria;
import com.iwaodev.ui.response.BaseResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ContactController {

  private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

  @Autowired
  private ContactService service;

  /**
   * submit contact form 
   *
   **/
  @PostMapping("/contact")
  public ResponseEntity<BaseResponse> post(
      @Valid @RequestBody ContactCriteria criteria, 
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) {

    if (authUser != null) {
      // member
      this.service.submit(criteria, authUser.getId());
    } else {
      // guest
      this.service.submit(criteria);
    }

	  return new ResponseEntity<>(
        new BaseResponse("successfully submitted:)"),
        HttpStatus.OK
        );
  }

}


