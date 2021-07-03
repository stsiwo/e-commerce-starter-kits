package com.iwaodev.ui.response;

import com.iwaodev.application.dto.user.UserDTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class AuthenticationResponse {

  private String jwt;

  private UserDTO user;

  private String csrfToken;

  public AuthenticationResponse(UserDTO user, String jwt, String csrfToken) {
    this.user = user;
    this.jwt = jwt;
    this.csrfToken = csrfToken;
  }
}
