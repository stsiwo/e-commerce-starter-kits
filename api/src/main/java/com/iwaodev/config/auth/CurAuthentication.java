package com.iwaodev.config.auth;

import java.util.List;

import com.iwaodev.domain.user.UserTypeEnum;

import org.springframework.security.core.Authentication;

/**
 * get current auth user info with Authentication.
 *
 * if the request came fom another api (e.g., Stripe) this does not work as you expected, so be careful.
 *
 **/
public interface CurAuthentication {

  public Authentication getAuthentication();

  public List<UserTypeEnum> getRole();

  public boolean isAuth();
}

