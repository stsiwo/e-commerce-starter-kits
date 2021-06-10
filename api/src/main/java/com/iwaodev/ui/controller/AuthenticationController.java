package com.iwaodev.ui.controller;

import javax.servlet.http.HttpServletResponse;

import com.iwaodev.application.iservice.AuthenticationService;
import com.iwaodev.config.SpringSecurityUserDetailsService;
import com.iwaodev.ui.criteria.AuthenticationRequestCriteria;
import com.iwaodev.ui.response.AuthenticationResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {

  private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private SpringSecurityUserDetailsService userDetailsService;

  @Autowired
  private AuthenticationService authenticationService;

  /**
   * authenticate non-logged in user.
   * 
   **/
  @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
  public ResponseEntity<AuthenticationResponse> index(@RequestBody AuthenticationRequestCriteria criteria,
      HttpServletResponse response) throws Exception {

    logger.info("received credentials: " + criteria.getEmail() + " and " + criteria.getPassword());

    try {
      this.authenticationManager
          .authenticate(new UsernamePasswordAuthenticationToken(criteria.getEmail(), criteria.getPassword()));
    } catch (BadCredentialsException e) {
      throw new Exception("Incorrect User Email or Password", e);
    }

    final UserDetails userDetails = this.userDetailsService.loadUserByUsername(criteria.getEmail());

    //
    AuthenticationResponse authResponse = this.authenticationService.login(userDetails.getUsername(), criteria.getEmail(), response);

    return new ResponseEntity<>(authResponse, HttpStatus.OK);

  }

}
