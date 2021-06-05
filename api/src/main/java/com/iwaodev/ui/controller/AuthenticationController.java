package com.iwaodev.ui.controller;

import java.util.Optional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.mapper.UserMapper;
import com.iwaodev.config.ApiTokenCookieConfig;
import com.iwaodev.config.SpringSecurityUserDetailsService;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.AuthenticationRequestCriteria;
import com.iwaodev.ui.response.AuthenticationResponse;
import com.iwaodev.util.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
  private JwtUtil jwtUtil;

  @Autowired
  private ApiTokenCookieConfig apiTokenCookieConfig;

  @Autowired
  private UserRepository userRepository;

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

    final String jwt = this.jwtUtil.generateToken(userDetails);

    /**
     * set jwt to cookie (httponly & secure)
     *
     **/

    logger.info("api token cookie security info: ");
    logger.info(apiTokenCookieConfig.toString());

    // this is for localhost since if you set 'domain' it does not work even if it
    // is empty string
    if (!apiTokenCookieConfig.getDomain().isEmpty()) {

      ResponseCookie cookie = ResponseCookie.from("api-token", jwt)
          .sameSite(apiTokenCookieConfig.getSameSite())
          .maxAge(apiTokenCookieConfig.getTimeout())
          .secure(apiTokenCookieConfig.getSecure())
          .httpOnly(apiTokenCookieConfig.getHttpOnly())
          .domain(apiTokenCookieConfig.getDomain())
          .path(apiTokenCookieConfig.getPath())
          .build();

      response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    } else {
      ResponseCookie cookie = ResponseCookie.from("api-token", jwt)
          .sameSite(apiTokenCookieConfig.getSameSite())
          .maxAge(apiTokenCookieConfig.getTimeout())
          .secure(apiTokenCookieConfig.getSecure())
          .httpOnly(apiTokenCookieConfig.getHttpOnly())
          //.domain(apiTokenCookieConfig.getDomain())
          .path(apiTokenCookieConfig.getPath())
          .build();

      response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    /**
     * find the user for response
     **/
    User user = this.userRepository.findByEmail(criteria.getEmail());

    /**
     * fetch its child entities manually because of lazy loading.
     *
     **/
    user.getAddresses();
    user.getPhones();
    user.getCompanies(); // only for admin

    UserDTO userDTO = UserMapper.INSTANCE.toUserDTO(user);

    return new ResponseEntity<>(new AuthenticationResponse(userDTO, jwt), HttpStatus.OK);

  }

}
