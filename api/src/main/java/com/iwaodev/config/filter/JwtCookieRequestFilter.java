package com.iwaodev.config.filter;

import java.io.IOException;
import java.util.Arrays;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.iwaodev.config.SpringSecurityUserDetailsService;
import com.iwaodev.util.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * a filter to check request cookie (httpOnly & secure) and validate it to
 * authorize the user access
 *
 *
 **/

@Component
public class JwtCookieRequestFilter extends OncePerRequestFilter {

  private static final Logger logger = LoggerFactory.getLogger(JwtCookieRequestFilter.class);

  @Autowired
  private SpringSecurityUserDetailsService userDetailsService;

  @Autowired
  private JwtUtil jwtUtil;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    logger.info("start processing jwt request filter");

    Cookie[] curCookies = request.getCookies();

    Cookie apiTokenCookie = null;

    if (curCookies != null) {
      apiTokenCookie = Arrays.stream(request.getCookies()).filter(cookie -> cookie.getName().equals("api-token"))
          .findFirst().orElse(null);
    }

    String userEmail = null;
    String jwt = null;

    if (apiTokenCookie != null) {
      jwt = apiTokenCookie.getValue();
      userEmail = jwtUtil.extractUserEmail(jwt);
    }

    logger.info("extracted jwt: " + jwt);
    logger.info("user email: " + userEmail);

    if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

      UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

      if (jwtUtil.validateToken(jwt, userDetails)) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
            userDetails, null, userDetails.getAuthorities());

        usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

      }
    }

    chain.doFilter(request, response);
  }
}
