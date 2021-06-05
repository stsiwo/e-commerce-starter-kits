package com.iwaodev.ui.controller;

import java.util.Map;

import javax.validation.Valid;

import com.iwaodev.application.iservice.ForgotPasswordService;
import com.iwaodev.ui.criteria.ResetPasswordCriteria;
import com.iwaodev.ui.response.BaseResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ForgotPasswordController {

  private static final Logger logger = LoggerFactory.getLogger(ForgotPasswordController.class);

  private ForgotPasswordService service;

  @Autowired
  public ForgotPasswordController(ForgotPasswordService service) {
    this.service = service;
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<BaseResponse> index(
      @RequestBody Map<String, String> body
      ) { 

    String email = body.get("email");

    if (email.isEmpty() || email == null) {
      logger.info("email is missing.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email is missing.");
    }

    this.service.requestForgotPassword(email);

    return new ResponseEntity<>(new BaseResponse("please check your email box."), HttpStatus.OK);
  }

  @PostMapping("/reset-password")
  public ResponseEntity<BaseResponse> index(
      @Valid @RequestBody ResetPasswordCriteria criteria 
      ) { 

    this.service.resetPassword(criteria);

    return new ResponseEntity<>(new BaseResponse("password was successfully reset."), HttpStatus.OK);
  }
}

