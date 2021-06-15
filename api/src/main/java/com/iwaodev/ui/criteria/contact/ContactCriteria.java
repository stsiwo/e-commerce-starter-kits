package com.iwaodev.ui.criteria.contact;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class ContactCriteria {

  @NotEmpty(message = "first name can not be null.")
  private String firstName;

  @NotEmpty(message = "last name can not be null.")
  private String lastName;

  @NotEmpty(message = "email can not be null.")
  @Email(message = "email must be valid format.")
  private String email;

  @NotEmpty(message = "title can not be null.")
  private String title;

  @NotEmpty(message = "description can not be null.")
  private String description;
}

