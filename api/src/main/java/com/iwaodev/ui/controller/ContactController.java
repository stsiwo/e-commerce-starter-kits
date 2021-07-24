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
import org.springframework.util.MimeType;
import org.springframework.web.bind.annotation.*;

@RestController
public class ContactController {

  private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

  @Autowired
  private ContactService service;

  /**
   * submit contact form 
   *
   **/
  @RequestMapping(value = "/contact", method = RequestMethod.POST, consumes = "application/x-www-form-urlencoded")
  public ResponseEntity<BaseResponse> post(
      @Valid ContactCriteria criteria,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

    logger.info("criteria");
    logger.info(criteria.getEmail());

    if (authUser != null) {
      // member
      this.service.submit(criteria, authUser.getId());
    } else {
      // guest
      this.service.submit(criteria, null);
    }

	  return new ResponseEntity<>(
        new BaseResponse("successfully submitted:)"),
        HttpStatus.OK
        );
  }

}


