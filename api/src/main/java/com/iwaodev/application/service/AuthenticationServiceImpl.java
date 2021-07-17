package com.iwaodev.application.service;

import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

import javax.servlet.http.HttpServletResponse;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.application.dto.user.CompanyDTO;
import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.irepository.CategoryRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.AuthenticationService;
import com.iwaodev.application.iservice.CategoryService;
import com.iwaodev.application.mapper.CategoryMapper;
import com.iwaodev.application.mapper.UserMapper;
import com.iwaodev.application.specification.factory.CategorySpecificationFactory;
import com.iwaodev.config.ApiTokenCookieConfig;
import com.iwaodev.config.service.CookieService;
import com.iwaodev.domain.category.CategorySortEnum;
import com.iwaodev.infrastructure.model.Category;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.category.CategoryCriteria;
import com.iwaodev.ui.criteria.category.CategoryQueryStringCriteria;
import com.iwaodev.ui.response.AuthenticationResponse;
import com.iwaodev.util.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthenticationServiceImpl implements AuthenticationService {

  private static final Logger logger = LoggerFactory.getLogger(AuthenticationServiceImpl.class);

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private ApiTokenCookieConfig apiTokenCookieConfig;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private CookieService cookieService;

  @Override
  public AuthenticationResponse login(String email, HttpServletResponse response) throws Exception {

    /**
     * find the user for response
     **/
    User user = this.userRepository.findActiveOrTempByEmail(email);

    /**
     * create jwt cookie and assign to this response
     */
    final String jwt = this.jwtUtil.generateToken(user.getUserId().toString());

    this.assignApiTokenCookieToResponse(jwt, response);
    String csrfToken = this.assignCsrfTokenCookieToResponse(response);

    /**
     * fetch its child entities manually because of lazy loading.
     *
     **/
    UserDTO userDTO = UserMapper.INSTANCE.toUserDTO(user);

    return new AuthenticationResponse(userDTO, jwt, csrfToken);
  }

  @Override
  public void assignApiTokenCookieToResponse(String jwt, HttpServletResponse response) throws Exception {

    /**
     * set jwt to cookie (httponly & secure)
     *
     **/
    logger.info("api token cookie security info: ");
    logger.info(apiTokenCookieConfig.toString());

    ResponseCookie cookie = this.cookieService.createApiTokenCookie(jwt);

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }

  @Override
  public String assignCsrfTokenCookieToResponse(HttpServletResponse response) throws Exception {

    String token = this.passwordEncoder.encode(UUID.randomUUID().toString());

    ResponseCookie cookie = this.cookieService.createCsrfTokenCookie(token);

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    return token;
  }
}
