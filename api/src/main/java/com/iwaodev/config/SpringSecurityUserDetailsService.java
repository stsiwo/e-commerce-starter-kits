package com.iwaodev.config;

import java.util.ArrayList;
import java.util.List;

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
   * DON'T throw 'UsernameNotFoundException' since it is converted to 'BadCredentialException'. I don't know why.
   *
   * - this is because 'hideUserNotFoundExceptions' property. that's why it converts to 'badCredentialException'. 
   *
   *   - need to enable it if you want to display it.
   *
   *   - ref: https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/authentication/dao/AbstractUserDetailsAuthenticationProvider.java
   *
   * instead, use 'RunTimeException' so that it is caught by 'authenticationEntryPoint' handler (see SpringSecurityConfig.java).
   **/
  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

    logger.info("start load user by user name");

    /**
     * find the user with userRepo (hibernate)
     **/
    /**
     * - only 'ACTIVE'/'TEMP'
     **/
    com.iwaodev.infrastructure.model.User loginUser = this.userRepository.findActiveOrTempByEmail(email);

    /**
     * if the user is not found
     **/
    if (loginUser == null) {
      logger.info("target user not found by findActiveOrTempByEmail");
      throw new UsernameNotFoundException("NOT_FOUND");
    }

    logger.info("this user tries to login: " + loginUser.getEmail());

    /**
     * prepare granded authority
     **/
    String role = this.userRepository.getUserRole(email);

    if (role == null) {
      throw new UsernameNotFoundException("the user does not have any role. this shouldn't be happened.");
    }

    GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

    List<GrantedAuthority> grantList = new ArrayList<GrantedAuthority>();

    grantList.add(authority);

    logger.info("this user's role: " + role);

    /**
     * construct UserDetails for return
     **/
    UserDetails userDetails = new SpringSecurityUser(loginUser.getUserId(), loginUser.getEmail(),
        loginUser.getPassword(), grantList);

    logger.info("start returning this userDetails");

    return userDetails;

  }

}
