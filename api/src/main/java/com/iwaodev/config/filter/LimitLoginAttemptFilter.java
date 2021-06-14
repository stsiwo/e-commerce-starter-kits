package com.iwaodev.config.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.config.service.LoginAttemptService;
import com.iwaodev.ui.response.BaseResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * a filter to check request cookie (httpOnly & secure) and validate it to
 * authorize the user access
 *
 *
 **/

@Component
public class LimitLoginAttemptFilter extends OncePerRequestFilter {

  private static final Logger logger = LoggerFactory.getLogger(LimitLoginAttemptFilter.class);

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private LoginAttemptService loginAttemptService;

  /**
   **/
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    String ip = getClientIP(request);
    if (loginAttemptService.isBlocked(ip)) {
      errorResponse(response, 429, "too many login attempt. come back in 30 mins.");
    }

    chain.doFilter(request, response);
  }

  private void errorResponse(HttpServletResponse response, int statusCode, String message) throws IOException {
    response.setStatus(statusCode);
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.getWriter()
        .write(this.objectMapper.writeValueAsString(new BaseResponse(message)));

  }

  private String getClientIP(HttpServletRequest request) {
    String xfHeader = request.getHeader("X-Forwarded-For");
    if (xfHeader == null) {
      return request.getRemoteAddr();
    }
    return xfHeader.split(",")[0];
  }
}

