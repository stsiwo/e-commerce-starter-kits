package com.iwaodev.config.listener;

import javax.servlet.http.HttpServletRequest;

import com.iwaodev.config.service.LoginAttemptService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationSuccessEventListener implements ApplicationListener<AuthenticationSuccessEvent> {

  private static final Logger logger = LoggerFactory.getLogger(AuthenticationSuccessEventListener.class);

  @Autowired
  private HttpServletRequest request;

  @Autowired
  private LoginAttemptService loginAttemptService;

  @Override
  public void onApplicationEvent(final AuthenticationSuccessEvent e) {

    final String xfHeader = request.getHeader("X-Forwarded-For");
    if (xfHeader == null) {
      loginAttemptService.loginSucceeded(request.getRemoteAddr());
    } else {
      loginAttemptService.loginSucceeded(xfHeader.split(",")[0]);
    }
  }
}
