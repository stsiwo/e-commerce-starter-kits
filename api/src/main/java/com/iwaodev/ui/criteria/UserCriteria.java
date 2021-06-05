package com.iwaodev.ui.criteria;

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
  /**
   * this might be null if the user does not want to update password (e.g., optional).
   *
   * Also, need to find a way to vaildate conditionally (e.g., validate if this value is not null, otherwise not validate)
   *
   *  - you need to use custom validator annotation. see http://dolszewski.com/spring/custom-validation-annotation-in-spring/
   * 
   **/
  @Password
  @Size(min = 8, message = "password must be greater than or equal to 8") 
  private String password;

  /**
   * change requirement (disable updating child entity at user endpoint)
   *
   **/
  //@Valid
  // DON'T forget initialize this list otherwise, you get 'nullpointerexception' from mapstruct
  //private List<UserPhoneCriteria> phones = new ArrayList<>();

}
