package com.iwaodev.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * logging.
 *
 * log for the following packages:
 *
 * 1. com.iwaodev.application 2. com.iwaodev.infrastructure 3. com.iwaodev.ui 4.
 * com.iwaodev.domain
 *
 **/

@Aspect
@Component
public class LoggerAspect {

  private final Logger logger = LoggerFactory.getLogger(this.getClass());

  /**
   * trying to log all of class with 'execution(* com.iwaodev.infrastructure..*(..))' causes nullpointerexception or other errors.
   *
   * TODO: fix this when you have time.
   *
   **/
  //@Before("execution(* com.iwaodev.application..*(..)) || execution(* com.iwaodev.ui..*(..)) || execution(* com.iwaodev.infrastructure..*(..)) || execution(* com.iwaodev.domain..*(..))")
  @Before("execution(* com.iwaodev.application..*(..)) || execution(* com.iwaodev.ui..*(..))")
  public void before(JoinPoint joinPoint) {
    // Advice
    logger.debug(String.format("start handling %s", joinPoint.getSignature()));
  }
}
