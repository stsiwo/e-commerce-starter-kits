package com.iwaodev.auth;

import com.iwaodev.infrastructure.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;

@Data
@AllArgsConstructor
public class AuthenticationInfo {

  @NonNull
  User authUser;

  @NonNull
  String jwtToken;

  @NonNull
  String csrfToken;

}


