package com.iwaodev.ui.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.validation.Valid;

import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.iservice.UserSignupService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.ui.criteria.UserSignupCriteria;
import com.iwaodev.ui.response.BaseResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RestController
public class UserSignupController {

  private static final Logger logger = LoggerFactory.getLogger(UserSignupController.class);

  private UserSignupService service;

  @Autowired
  public UserSignupController(UserSignupService service) {
    this.service = service;
  }

  @PostMapping("/signup")
  public String index(
      @Valid @RequestBody UserSignupCriteria criteria,
      RedirectAttributes redirectAttributes) { // use @Valid instead of @Validated

    logger.debug("user criteria (query string)");
    logger.debug(criteria.toString());
    logger.debug("user controller cur thread name: " + Thread.currentThread().getName());

    /**
     * redirect after signup to authenticate to create api-token cookie
     *
     **/
    
    UserDTO user = this.service.signup(criteria);

    /**
     * redirect to login endpoint
     **/
    redirectAttributes.addAttribute("email", user.getEmail());
    redirectAttributes.addAttribute("password", criteria.getPassword());

    return "redirect:/authenticate";
  }

  @GetMapping("/account-verify")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<UserDTO> accountVerify(
      @RequestParam(name = "account-verify-token") String verificationToken,
      @AuthenticationPrincipal SpringSecurityUser authUser) { // use @Valid instead of @Validated

    /**
     * redirect after signup to authenticate to create api-token cookie
     *
     **/
    UserDTO user = this.service.verifyAccount(authUser.getId(), verificationToken);

    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @PostMapping("/reissue-account-verify")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<BaseResponse> reissueAccountVerify(
      @RequestParam(name = "account-verify-token") String verificationToken,
      @AuthenticationPrincipal SpringSecurityUser authUser) { // use @Valid instead of @Validated

    /**
     * redirect after signup to authenticate to create api-token cookie
     *
     **/
    UserDTO user = this.service.reissueVerification(authUser.getId());

    return new ResponseEntity<>(new BaseResponse("re-issued the verification email successfully."), HttpStatus.OK);
  }
}
