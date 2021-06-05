package com.iwaodev.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DomainException extends Exception {

  private static final Logger logger = LoggerFactory.getLogger(DomainException.class);

  private static final long serialVersionUID = 1L;

  public DomainException(String errorMessage) {
    super(errorMessage);
    logger.info(errorMessage);
  }
}

