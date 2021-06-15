package com.iwaodev.config.auth;

import java.util.List;

import com.iwaodev.domain.user.UserTypeEnum;

import org.springframework.security.core.Authentication;

public interface CurAuthentication {

  public Authentication getAuthentication();

  public List<UserTypeEnum> getRole();
}

