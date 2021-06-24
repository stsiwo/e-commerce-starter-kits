package com.iwaodev.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class AppException extends Exception {

  private static final Logger logger = LoggerFactory.getLogger(AppException.class);

  private static final long serialVersionUID = 1L;

  private HttpStatus status;

  public AppException(HttpStatus status, String errorMessage) {
    super(errorMessage);
    this.status = status;
    logger.info(errorMessage);
  }
}


