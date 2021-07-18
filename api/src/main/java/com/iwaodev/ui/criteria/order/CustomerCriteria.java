package com.iwaodev.ui.criteria.order;

import java.util.UUID;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * use @NotEmpty for String type
 * use @NotNull for any other type rather than String
 * use @Valid for nested Criteria class
 **/

@ToString
@Data
@NoArgsConstructor
@Validated
public class CustomerCriteria {

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

}



