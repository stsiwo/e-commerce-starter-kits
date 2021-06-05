package com.iwaodev.ui.criteria;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class UserSignupCriteria {

  @NotEmpty(message = "first name must not be null.")
  private String firstName;

  @NotEmpty(message = "last name must not be null.")
  private String lastName;

  @NotEmpty(message = "email must not be null.")
  @Email(message = "email must be valid format.")
  private String email;

  /**
   * #TODO: comply the PCI standard. 
   **/
  @NotEmpty(message = "password must not be null.")
  @Size(min = 8, message = "password must be greater than or equal to 8") 
  private String password;

}
