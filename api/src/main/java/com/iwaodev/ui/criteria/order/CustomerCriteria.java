package com.iwaodev.ui.criteria.order;

import java.util.UUID;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

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

  @NotEmpty(message = "user id must not be null.")
  private UUID userId;
  
  @NotEmpty(message = "first name must not be null.")
  private String firstName;

  @NotEmpty(message = "last name must not be null.")
  private String lastName;

  @NotEmpty(message = "email must not be null.")
  @Email(message = "email must be valid format.")
  private String email;

}



