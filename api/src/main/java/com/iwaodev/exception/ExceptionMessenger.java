package com.iwaodev.exception;

import org.springframework.stereotype.Component;

/**
 * provide a template for AppException.
 * 
 **/
@Component
public class ExceptionMessenger {

  /**
   * bad request (400)
   **/
  public String getBadRequestMessage(String domain, String value) {
    return String.format("%s has invalid value (value: %s)", domain, value);
  }

  /**
   * not found (404)
   **/
  public String getNotFoundMessage(String domain, String id) {
    return String.format("%s not found (id: %s)", domain, id);
  }

}
