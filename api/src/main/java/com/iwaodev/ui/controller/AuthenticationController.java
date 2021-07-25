package com.iwaodev.ui.controller;

import javax.servlet.http.HttpServletResponse;

import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.AuthenticationService;
import com.iwaodev.config.SpringSecurityUserDetailsService;
import com.iwaodev.infrastructure.model.User;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.iwaodev.exception.AppException;

import java.util.Optional;

@RestController
public class AuthenticationController {

  private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private SpringSecurityUserDetailsService userDetailsService;

  @Autowired
  private AuthenticationService authenticationService;

  @Autowired
  private UserRepository userRepository;

  /**
   * authenticate non-logged in user.
   * 
   **/
  @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
  public ResponseEntity<AuthenticationResponse> index(@RequestBody AuthenticationRequestCriteria criteria,
      HttpServletResponse response) throws Exception {

    /**
     * we need to retrieve the user first since UsernamePasswordAuthenticationToken requires userId and password.
     * we use userid as username
     */
    Optional<User> userOptional = this.userRepository.findByEmail(criteria.getEmail());
    if (!userOptional.isPresent()) {
      throw new AppException(HttpStatus.NOT_FOUND, "the email is not registered.");
    }

    User user = userOptional.get();

    try {
      // use the email as username and this authenticate() use my implementation of 'SpringSecurityUserDetailsService#loadUserByUsername'
      // to compare the credential of this input and credential stored in db and provide the result.
      Authentication authentication = this.authenticationManager
          .authenticate(new UsernamePasswordAuthenticationToken(user.getUserId().toString(), criteria.getPassword()));
    } catch (UsernameNotFoundException e) {
      throw new AppException(HttpStatus.NOT_FOUND, "the email is not registered.");
    } catch (BadCredentialsException e) {
      throw new AppException(HttpStatus.BAD_REQUEST, "incorrect password");
    }

    AuthenticationResponse authResponse = this.authenticationService.login(criteria.getEmail(), response);

    return new ResponseEntity<>(authResponse, HttpStatus.OK);

  }

}
