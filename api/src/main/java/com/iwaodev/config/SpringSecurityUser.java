package com.iwaodev.config;

import java.util.Collection;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class SpringSecurityUser extends User {

  private UUID id;

  public SpringSecurityUser(UUID id, String username, String password, Collection<? extends GrantedAuthority> authorities) {
		super(username, password, authorities);
		//TODO Auto-generated constructor stub
    this.id = id;
	}

  public UUID getId() {
    return this.id;
  }
}
