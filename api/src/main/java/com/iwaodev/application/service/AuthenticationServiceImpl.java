package com.iwaodev.application.service;

import java.util.Optional;
import java.util.function.Function;

import javax.servlet.http.HttpServletResponse;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.irepository.CategoryRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.AuthenticationService;
import com.iwaodev.application.iservice.CategoryService;
import com.iwaodev.application.mapper.CategoryMapper;
import com.iwaodev.application.mapper.UserMapper;
import com.iwaodev.application.specification.factory.CategorySpecificationFactory;
import com.iwaodev.config.ApiTokenCookieConfig;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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

  @Override
  public AuthenticationResponse login(String userName, String email, HttpServletResponse response) {

    final String jwt = this.jwtUtil.generateToken(userName);

    this.assignApiTokenCookieToResponse(jwt, response);

    /**
     * find the user for response
     **/
    User user = this.userRepository.findActiveOrTempByEmail(email);

    /**
     * fetch its child entities manually because of lazy loading.
     *
     **/
    user.getAddresses();
    user.getPhones();
    user.getCompanies(); // only for admin

    UserDTO userDTO = UserMapper.INSTANCE.toUserDTO(user);

    return new AuthenticationResponse(userDTO, jwt);
  }

  @Override
  public void assignApiTokenCookieToResponse(String jwt, HttpServletResponse response) {

    /**
     * set jwt to cookie (httponly & secure)
     *
     **/
    logger.info("api token cookie security info: ");
    logger.info(apiTokenCookieConfig.toString());

    // this is for localhost since if you set 'domain' it does not work even if it
    // is empty string
    if (!apiTokenCookieConfig.getDomain().isEmpty()) {

      ResponseCookie cookie = ResponseCookie.from("api-token", jwt).sameSite(apiTokenCookieConfig.getSameSite())
          .maxAge(apiTokenCookieConfig.getTimeout()).secure(apiTokenCookieConfig.getSecure())
          .httpOnly(apiTokenCookieConfig.getHttpOnly()).domain(apiTokenCookieConfig.getDomain())
          .path(apiTokenCookieConfig.getPath()).build();

      response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    } else {
      ResponseCookie cookie = ResponseCookie.from("api-token", jwt).sameSite(apiTokenCookieConfig.getSameSite())
          .maxAge(apiTokenCookieConfig.getTimeout()).secure(apiTokenCookieConfig.getSecure())
          .httpOnly(apiTokenCookieConfig.getHttpOnly())
          // .domain(apiTokenCookieConfig.getDomain())
          .path(apiTokenCookieConfig.getPath()).build();

      response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
  }
}
