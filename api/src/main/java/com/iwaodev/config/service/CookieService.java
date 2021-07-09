package com.iwaodev.config.service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.iwaodev.config.ApiTokenCookieConfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class CookieService {

  @Autowired
  private ApiTokenCookieConfig apiTokenCookieConfig;


  public ResponseCookie createApiTokenCookie(String jwt) {
      ResponseCookie cookie = ResponseCookie.from("api-token", jwt).sameSite(apiTokenCookieConfig.getSameSite())
          .maxAge(apiTokenCookieConfig.getTimeout()).secure(apiTokenCookieConfig.getSecure())
          .httpOnly(apiTokenCookieConfig.getHttpOnly()).domain(apiTokenCookieConfig.getDomain())
          .path(apiTokenCookieConfig.getPath()).build();
      return cookie;
  }

  public ResponseCookie createCsrfTokenCookie(String csrfToken) {
      ResponseCookie cookie = ResponseCookie.from("csrf-token", csrfToken).sameSite(apiTokenCookieConfig.getSameSite())
          .maxAge(apiTokenCookieConfig.getTimeout()).secure(apiTokenCookieConfig.getSecure())
          .domain(apiTokenCookieConfig.getDomain()).path(apiTokenCookieConfig.getPath()).build();

      return cookie;
  }

  public void eraseCookies(HttpServletRequest req, HttpServletResponse resp) {
    Cookie[] cookies = req.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        // delete only tokens since cookie might include other important cookie like stripe session id so be careful.
        if (cookie.getName().equals("api-token") || cookie.getName().equals("csrf-token")) {
          cookie.setValue("");
          cookie.setDomain(apiTokenCookieConfig.getDomain());
          cookie.setPath("/");
          cookie.setMaxAge(0);
          resp.addCookie(cookie);
        }
      }
    }
  }


}

