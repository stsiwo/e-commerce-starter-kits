package com.iwaodev.aop;

import com.iwaodev.application.event.EventHandlerChecker;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * used to check an annotated event handler is called or not.
 *
 * mainly used for testing purpose.
 *
 * annotate this (e.g., com.iwaodev.annotation.EventHandlerCheck) to every event handler to make sure that an event and its corresponding handlers are called properly.
 *
 **/

@Aspect
@Component
public class EventHandlerCheckAspect {
	
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

  @Autowired
  private EventHandlerChecker eventHandlerChecker;
	
	@Around("@annotation(com.iwaodev.annotation.EventHandlerCheck)")
	public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
		//Advice
    logger.info("aspect event handler checker.");
    String result = this.eventHandlerChecker.check(joinPoint.getClass().getName()); 
    logger.info(result);
    return joinPoint.proceed();
    
	}
}
