package com.iwaodev.application.iservice;

import javax.servlet.http.HttpServletResponse;

import com.iwaodev.ui.response.AuthenticationResponse;

public interface AuthenticationService {

  /**
   * login 
   **/
  public AuthenticationResponse login(String email, HttpServletResponse response) throws Exception;

  /**
   * assign jwt cookies to response
   **/
  public void assignApiTokenCookieToResponse(String jwt, HttpServletResponse response) throws Exception;

  /**
   * assign csrf token cookie to reponse.
   **/
  public String assignCsrfTokenCookieToResponse(HttpServletResponse response) throws Exception;
}




