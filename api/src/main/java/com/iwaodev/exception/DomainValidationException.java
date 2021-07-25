package com.iwaodev.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DomainValidationException extends Exception {

  private static final Logger logger = LoggerFactory.getLogger(DomainValidationException.class);

  private static final long serialVersionUID = 1L;

  public DomainValidationException(String errorMessage) {
    super(errorMessage);
    logger.debug(errorMessage);
  }
}

