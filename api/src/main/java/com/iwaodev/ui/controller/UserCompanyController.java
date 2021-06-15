package com.iwaodev.ui.controller;

import java.util.List;
import java.util.UUID;

import javax.validation.Valid;

import com.iwaodev.application.dto.company.CompanyDTO;
import com.iwaodev.application.iservice.CompanyService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.ui.criteria.user.UserCompanyCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class UserCompanyController {

  private static final Logger logger = LoggerFactory.getLogger(UserCompanyController.class);

  @Autowired
  private CompanyService service;

  @GetMapping("/users/{userId}/companies")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // only admin
  public ResponseEntity<List<CompanyDTO>> get(
      @PathVariable(value = "userId") UUID userId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) {
    return new ResponseEntity<>(this.service.get(userId), HttpStatus.OK);
  }

  // replace an existing company of a given user
  @PutMapping("/users/{userId}/companies/{companyId}")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // only admin 
  public ResponseEntity<CompanyDTO> put(
      @PathVariable(value = "userId") UUID userId,
      @PathVariable(value = "companyId") Long companyId,
      @AuthenticationPrincipal SpringSecurityUser authUser,
      @Valid @RequestBody UserCompanyCriteria criteria
      ) {
    return new ResponseEntity<>(this.service.update(criteria, userId, companyId), HttpStatus.OK);
  }
}


