package com.iwaodev.application.iservice;

import javax.servlet.http.HttpServletResponse;

import com.iwaodev.ui.response.AuthenticationResponse;

public interface AuthenticationService {

  /**
   * login 
   **/
  public AuthenticationResponse login(String userName, String email, HttpServletResponse response);

  /**
   * assign jwt cookies to response
   **/
  public void assignApiTokenCookieToResponse(String jwt, HttpServletResponse response);

  /**
   * 
   **/
}




