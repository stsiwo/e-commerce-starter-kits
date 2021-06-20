package com.iwaodev.ui.criteria.user;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

import com.iwaodev.domain.user.validator.UserEmailUnique;
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

  @NotEmpty(message = "{user.firstName.notempty}")
  private String firstName;

  @NotEmpty(message = "{user.lastName.notempty}")
  private String lastName;

  @UserEmailUnique()
  @NotEmpty(message = "{user.email.notempty}")
  @Email(message = "{user.email.invalidformat}")
  private String email;

  @Password(optional = false, message = "{user.password.invalidformat}")
  private String password;

}
