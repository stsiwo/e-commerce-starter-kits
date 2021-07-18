package com.iwaodev.ui.criteria.user;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;
import javax.validation.constraints.NotEmpty;

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
  @Size(max = 100, message = "{user.firstName.max100}")
  private String firstName;

  @NotEmpty(message = "{user.lastName.notempty}")
  @Size(max = 100, message = "{user.lastName.max100}")
  private String lastName;

  @NotEmpty(message = "{user.email.notempty}")
  @Email(message = "{user.email.invalidformat}")
  @Size(max = 100, message = "{user.email.max100}")
  private String email;

  @Password(optional = false, message = "{user.password.invalidformat}")
  @Size(max = 100, message = "{user.password.max100}")
  private String password;

}
