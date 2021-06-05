package com.iwaodev.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InvalidUserTypeException extends Exception {

  private static final Logger logger = LoggerFactory.getLogger(InvalidUserTypeException.class);

  private static final long serialVersionUID = 1L;

  public InvalidUserTypeException(String errorMessage) {
    super(errorMessage);
    logger.info(errorMessage);
  }
}

