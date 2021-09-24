package com.iwaodev.ui.criteria.user;

import java.util.UUID;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

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

  @NotNull(message = "{user.id.notnull}")
  private UUID userId;
  
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

  /**
   * this might be null if the user does not want to update password (e.g., optional).
   *
   * password policy:
   *  - at least 8 chars
   *  - must include lower/upper case
   *  - no space (leading/trailing/middle)
   * 
   **/
  @Password(message = "{user.password.invalidformat}")
  @Size(max = 100, message = "{user.password.max100}")
  private String password;


  private Long version;
}
