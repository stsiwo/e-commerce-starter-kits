package com.iwaodev.ui.criteria.user;

import java.util.UUID;

import javax.validation.constraints.Email;
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
public class UserCriteria {

  private UUID userId;
  
  @NotEmpty(message = "first name can not be null.")
  private String firstName;

  @NotEmpty(message = "last name can not be null.")
  private String lastName;

  @NotEmpty(message = "email can not be null.")
  @Email(message = "email must be valid format.")
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
  private String password;
}
