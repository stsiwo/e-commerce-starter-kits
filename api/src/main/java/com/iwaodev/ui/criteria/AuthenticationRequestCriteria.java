package com.iwaodev.ui.criteria;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import com.iwaodev.ui.validator.password.Password;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class AuthenticationRequestCriteria {

  @NotEmpty( message = "email can not be null")
  private String email;

  /**
   * this might be null if the user does not want to update password (e.g., optional).
   *
   * password policy:
   *  - at least 8 chars
   *  - must include lower/upper case
   *  - no space (leading/trailing/middle)
   * 
   **/
  @Password(message = "invalid password format")
  @Size(min = 8, message = "password must be greater than or equal to 8") 
  @NotEmpty( message = "email can not be null")
  private String password;
}
