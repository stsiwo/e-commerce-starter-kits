package com.iwaodev.config;

import java.util.ArrayList;
import java.util.List;

import com.iwaodev.application.irepository.UserRepository;

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

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {


    /**
     * find the user with userRepo (hibernate)
     **/
    /**
     * #TODO: replace findByEmail with findByActiveByEmail.
     *  - this only retrieve active user (e.g., is_deleted = false)
     **/
    com.iwaodev.infrastructure.model.User loginUser = this.userRepository.findByEmail(email);

    /**
     * if the user is not found
     **/
    if (loginUser == null) {
      throw new UsernameNotFoundException("the user with email of " + email + " is not found");
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
    UserDetails userDetails = new SpringSecurityUser(
        loginUser.getUserId(),
        loginUser.getEmail(), 
        loginUser.getPassword(), 
        grantList 
        );

    logger.info("start returning this userDetails");

    return userDetails;

  }

}
