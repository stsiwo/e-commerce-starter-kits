package com.iwaodev.ui.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.iservice.AuthenticationService;
import com.iwaodev.application.iservice.UserSignupService;
import com.iwaodev.config.ApiTokenCookieConfig;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.ui.criteria.UserSignupCriteria;
import com.iwaodev.ui.response.AuthenticationResponse;
import com.iwaodev.ui.response.BaseResponse;
import com.iwaodev.util.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RestController
public class UserSignupController {

  private static final Logger logger = LoggerFactory.getLogger(UserSignupController.class);

  @Autowired
  private UserSignupService service;

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private ApiTokenCookieConfig apiTokenCookieConfig;

  @Autowired
  private AuthenticationService authenticationService;

  @PostMapping("/signup")
  public ResponseEntity<AuthenticationResponse> index(
      @Valid @RequestBody UserSignupCriteria criteria,
      HttpServletResponse response
      ) { // use @Valid instead of @Validated

    logger.debug("user criteria (query string)");
    logger.debug(criteria.toString());
    logger.debug("user controller cur thread name: " + Thread.currentThread().getName());

    UserDTO user = this.service.signup(criteria);

    // create api token
    // userDetails: userName -> email
    final String jwt = this.jwtUtil.generateToken(user.getEmail());

    this.authenticationService.assignApiTokenCookieToResponse(jwt, response);

    return new ResponseEntity<>(new AuthenticationResponse(user, jwt), HttpStatus.OK);
  }

  @GetMapping("/users/{id}/account-verify")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<UserDTO> accountVerify(
      @RequestParam(name = "account-verify-token") String verificationToken,
      @PathVariable(value = "id") UUID id,
      @AuthenticationPrincipal SpringSecurityUser authUser) { // use @Valid instead of @Validated

    /**
     * redirect after signup to authenticate to create api-token cookie
     *
     **/
    UserDTO user = this.service.verifyAccount(authUser.getId(), verificationToken);

    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @PostMapping("/users/{id}/reissue-account-verify")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<BaseResponse> reissueAccountVerify(
      @PathVariable(value = "id") UUID id,
      @AuthenticationPrincipal SpringSecurityUser authUser) { // use @Valid instead of @Validated

    /**
     * redirect after signup to authenticate to create api-token cookie
     *
     **/
    UserDTO user = this.service.reissueVerification(authUser.getId());

    return new ResponseEntity<>(new BaseResponse("re-issued the verification email successfully."), HttpStatus.OK);
  }
}
