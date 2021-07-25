package com.iwaodev.config.listener;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

import com.iwaodev.config.service.LoginAttemptService;

@Component
public class AuthenticationFailureListener implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {

  private static final Logger logger = LoggerFactory.getLogger(AuthenticationFailureListener.class);

  @Autowired
  private HttpServletRequest request;

  @Autowired
  private LoginAttemptService loginAttemptService;

  @Override
  public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent e) {

    final String xfHeader = request.getHeader("X-Forwarded-For");
    if (xfHeader == null) {
      loginAttemptService.loginFailed(request.getRemoteAddr());
    } else {
      loginAttemptService.loginFailed(xfHeader.split(",")[0]);
    }
  }
}
