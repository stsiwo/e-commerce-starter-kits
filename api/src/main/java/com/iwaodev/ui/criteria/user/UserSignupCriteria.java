package com.iwaodev.ui.criteria.user;

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
public class UserSignupCriteria {

  @NotEmpty(message = "first name can not be null.")
  private String firstName;

  @NotEmpty(message = "last name can not be null.")
  private String lastName;

  @NotEmpty(message = "email can not be null.")
  @Email(message = "email must be valid format.")
  private String email;

  @Password(optional = false, message = "invalid password.")
  private String password;

}
