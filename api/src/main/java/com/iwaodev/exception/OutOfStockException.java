package com.iwaodev.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OutOfStockException extends Exception {

  private static final Logger logger = LoggerFactory.getLogger(OutOfStockException.class);

  private static final long serialVersionUID = 1L;

  public OutOfStockException(String errorMessage) {
    super(errorMessage);
    logger.info(errorMessage);
  }
}

