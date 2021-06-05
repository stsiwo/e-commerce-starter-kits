package com.iwaodev.ui.criteria;

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

  @NotEmpty(message = "first name must not be null.")
  private String firstName;

  @NotEmpty(message = "last name must not be null.")
  private String lastName;

  @NotEmpty(message = "email must not be null.")
  private String email;

  @NotEmpty(message = "title must not be null.")
  private String title;

  @NotEmpty(message = "description must not be null.")
  private String description;
}

