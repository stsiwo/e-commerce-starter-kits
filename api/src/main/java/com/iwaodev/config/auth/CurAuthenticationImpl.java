package com.iwaodev.config.auth;

import java.util.ArrayList;
import java.util.List;

import com.iwaodev.domain.user.UserTypeEnum;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * used to access current logged-in user by SecurityContextHolder.
 * 
 **/
@Service
public class CurAuthenticationImpl implements CurAuthentication {

  private static final Logger logger = LoggerFactory.getLogger(CurAuthenticationImpl.class);

  @Override
  public Authentication getAuthentication() {
    return SecurityContextHolder.getContext().getAuthentication();
  }

  /**
   * get current user's authorities.
   *
   * if no current user, return null.
   **/
  @Override
  public List<UserTypeEnum> getRole() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth.getAuthorities() == null) {
      return null;
    }

    List<UserTypeEnum> userTypeList = new ArrayList<>();

    for (GrantedAuthority authority : auth.getAuthorities()) {
      String role = authority.getAuthority().substring(authority.getAuthority().indexOf("_") + 1);
      userTypeList.add(UserTypeEnum.valueOf(role));
    }
    return userTypeList;
  }

  @Override
  public boolean isAuth() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return (auth == null)? false : true;
  }
}
