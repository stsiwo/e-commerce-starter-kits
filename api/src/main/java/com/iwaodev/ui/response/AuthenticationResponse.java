package com.iwaodev.ui.response;

import com.iwaodev.application.dto.user.UserDTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class AuthenticationResponse {

  private String jwt;

  private UserDTO user;

  public AuthenticationResponse(UserDTO user, String jwt) {
    this.user = user;
    this.jwt = jwt;
  }
}
