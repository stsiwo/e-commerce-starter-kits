package com.iwaodev.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NotFoundException extends Exception {

  private static final Logger logger = LoggerFactory.getLogger(NotFoundException.class);

  private static final long serialVersionUID = 1L;

  public NotFoundException(String errorMessage) {
    super(errorMessage);
    logger.debug(errorMessage);
  }
}
