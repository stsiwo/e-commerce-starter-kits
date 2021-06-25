package com.iwaodev.config.filter;

import java.io.IOException;
import java.util.Arrays;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.config.SpringSecurityUserDetailsService;
import com.iwaodev.ui.response.BaseResponse;
import com.iwaodev.util.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.MalformedJwtException;

/**
 * a filter to check request cookie (httpOnly & secure) and validate it to
 * authorize the user access
 *
 * if you don't want the request to move to the next filter. you can do this by not calling 'doFilter' function.
 *
 * e.g., if you want to return 401 rsponse if jwt is invalid, you just don't need to call 'doFilter' if you know the jwt is invalid (e.g., try/catch)
 *
 **/

@Component
public class JwtCookieRequestFilter extends OncePerRequestFilter {

  private static final Logger logger = LoggerFactory.getLogger(JwtCookieRequestFilter.class);

  @Autowired
  private SpringSecurityUserDetailsService userDetailsService;

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private ObjectMapper objectMapper;

  /**
   * if cookie is empty, we assume that request is from a guest. so, we don't
   * validate the jwt and throw any exception.
   *
   * if the cookie is not empty, we assume that the request is member/admin so we
   * need to validate jwt then if it is not valid, throws
   * 'InvalidJWTTokenException'.
   *
   * also, retrieve email from jwt cookie and then find the user based on the
   * email.
   *
   **/
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    logger.debug("start processing jwt request filter");

    Cookie[] curCookies = request.getCookies();

    Cookie apiTokenCookie = null;

    if (curCookies != null) {
      apiTokenCookie = Arrays.stream(request.getCookies()).filter(cookie -> cookie.getName().equals("api-token"))
          .findFirst().orElse(null);
    }

    String userEmail = null;
    String jwt = null;

    boolean isGuest = true;
    if (apiTokenCookie != null) {
      isGuest = false;
      jwt = apiTokenCookie.getValue();

      try {
        userEmail = jwtUtil.extractUserEmail(jwt);
      } catch (MalformedJwtException e) {
        // force logout e.g., delete 'api-token' cookie
        this.eraseCookie(request, response);
        // return error response
        this.errorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "invalid jwt token. please login again.");
      }
    }

    // guest user skip below code.
    if (isGuest) {
      chain.doFilter(request, response);
    } 

    // member who must have api-token
    if (!isGuest) {

      logger.debug("extracted jwt: " + jwt);
      logger.debug("user email: " + userEmail);

      if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

        UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

        // validate jwt if it is not expired & user email match 
        if (jwtUtil.validateToken(jwt, userDetails)) {
          logger.debug("jwt is valid so let's move to the next filter.");

          UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
              userDetails, null, userDetails.getAuthorities());

          usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

          SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

          // if jwt is valid, let this move to next step.
          chain.doFilter(request, response);
        } else {
          // otherwise, jwt is invalid
          // force logout
          this.eraseCookie(request, response);
          // return error message
          this.errorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "invalid jwt token. please login again.");
        }
      }
    }

    logger.debug("jwt is invalid so let the user logout.");
  }

  private void eraseCookie(HttpServletRequest req, HttpServletResponse resp) {
    Cookie[] cookies = req.getCookies();
    if (cookies != null)
      for (Cookie cookie : cookies) {
        cookie.setValue("");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        resp.addCookie(cookie);
      }
  }

  private void errorResponse(HttpServletResponse response, int statusCode, String message) throws IOException {
    response.setStatus(statusCode);
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.getWriter().write(this.objectMapper.writeValueAsString(new BaseResponse(message)));

  }
}
