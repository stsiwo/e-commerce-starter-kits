package com.iwaodev.config.auth;

import java.util.ArrayList;
import java.util.List;

import com.iwaodev.domain.user.UserTypeEnum;

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

	@Override
	public Authentication getAuthentication() {
		return SecurityContextHolder.getContext().getAuthentication();
	}

	@Override
	public List<UserTypeEnum> getRole() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    List<UserTypeEnum> userTypeList = new ArrayList<>();

    for (GrantedAuthority authority: auth.getAuthorities()) {
      String role = authority.getAuthority().substring(authority.getAuthority().indexOf("_") + 1);
      userTypeList.add(UserTypeEnum.valueOf(role));
    }
		return userTypeList;
	}
}
