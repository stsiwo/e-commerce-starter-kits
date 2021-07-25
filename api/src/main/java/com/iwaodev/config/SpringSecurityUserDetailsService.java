package com.iwaodev.config;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.config.service.LoginAttemptService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class SpringSecurityUserDetailsService implements UserDetailsService {

  private static final Logger logger = LoggerFactory.getLogger(SpringSecurityUserDetailsService.class);

  @Autowired
  private UserRepository userRepository;

  /**
   *  load user by user id (not username).
   *
   *
   * DON'T throw 'UsernameNotFoundException' since it is converted to 'BadCredentialException'. I don't know why.
   *
   * - this is because 'hideUserNotFoundExceptions' property. that's why it converts to 'badCredentialException'. 
   *
   *   - need to enable it if you want to display it.
   *
   *   - ref: https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/authentication/dao/AbstractUserDetailsAuthenticationProvider.java
   *
   * instead, use 'RunTimeException' so that it is caught by 'authenticationEntryPoint' handler (see SpringSecurityConfig.java).
   *
   * @2021/07/17
   *  change from email to userId for username and subject value in jwt.
   *
   *  this is because of the following issues:
   *    1. security issue. it is not good practice to include sensistive debugrmation inside jwt since jwt is decoded outside.
   *    2. if a member change the email address, the subject value (e.g., email) is obsolete and make the member impossible to access their protected resource unless we force him to log out and login again.
   **/
  @Override
  public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {

    /**
     * find the user with userRepo (hibernate)
     **/
    /**
     * - only 'ACTIVE'/'TEMP'
     **/
    com.iwaodev.infrastructure.model.User loginUser = this.userRepository.findActiveOrTempById(UUID.fromString(userId));

    /**
     * if the user is not found
     **/
    if (loginUser == null) {
      logger.debug("target user not found by findActiveOrTempByEmail");
      throw new UsernameNotFoundException("NOT_FOUND");
    }
    /**
     * prepare granded authority
     **/
    String role = this.userRepository.getUserRole(UUID.fromString(userId));

    if (role == null) {
      throw new UsernameNotFoundException("the user does not have any role. this shouldn't be happened.");
    }

    GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

    List<GrantedAuthority> grantList = new ArrayList<GrantedAuthority>();

    grantList.add(authority);

    /**
     * construct UserDetails for return
     *
     * user userid as username of SpringSecurityUser. be careful.
     **/
    UserDetails userDetails = new SpringSecurityUser(loginUser.getUserId(), loginUser.getUserId().toString(), loginUser.getPassword(), grantList);

    return userDetails;

  }

}
