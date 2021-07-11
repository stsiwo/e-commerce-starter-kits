package com.iwaodev.application.event;

import com.iwaodev.exception.AppException;

public interface EventHandler<E> {

  /**
   * handle event 
   **/
  public void handleEvent(E event) throws AppException;
}




