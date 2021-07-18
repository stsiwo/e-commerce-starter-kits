package com.iwaodev.ui.criteria.contact;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;
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

  @NotEmpty(message = "{contact.firstName.notempty}")
  @Size(max = 100, message = "{contact.firstName.max100}")
  private String firstName;

  @NotEmpty(message = "{contact.lastName.notempty}")
  @Size(max = 100, message = "{contact.lastName.max100}")
  private String lastName;

  @NotEmpty(message = "{contact.email.notempty}")
  @Email(message = "{contact.email.invalidformat}")
  @Size(max = 100, message = "{contact.email.max100}")
  private String email;

  @NotEmpty(message = "{contact.title.notempty}")
  @Size(max = 500, message = "{contact.title.max500}")
  private String title;

  @NotEmpty(message = "{contact.description.notempty}")
  @Size(max = 10000, message = "{contact.description.max10000}")
  private String description;

  @NotEmpty(message = "{contact.recaptchaToken.notempty}")
  private String recaptchaToken;

}

