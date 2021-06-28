package com.iwaodev.ui.criteria.user;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class UserCompanyCriteria {

  private Long companyId;

  @NotEmpty(message = "company name can not be empty.")
  private String companyName;

  @NotEmpty(message = "company description can not be empty.")
  private String companyDescription;

  @NotEmpty(message = "company email can not be empty.")
  @Email(message = "invalid email format.")
  private String companyEmail;

  @NotEmpty(message = "company phone can not be empty.")
  @Pattern( regexp = "^[0-9]{10}$", message = "invalid phone number format. please enter only number without any special characater.")
  private String phoneNumber;

  @NotEmpty(message = "company country code can not be empty.")
  @Pattern( regexp = "^(\\+?\\d{1,3}|\\d{1,4})$", message = "invalid phone country code format.")
  private String countryCode;

  @NotEmpty(message = "company address 1 can not be empty.")
  private String address1;

  private String address2;

  @NotEmpty(message = "company address city can not be empty.")
  private String city;

  @NotEmpty(message = "company address province can not be empty.")
  private String province;

  @Size( max = 2, min = 2, message = "company address country must be exact 2 characters.")
  @NotEmpty(message = "company address country can not be empty.")
  private String country;

  @NotEmpty(message = "company address postal code can not be empty.")
  @Pattern( regexp = "^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$", message = "invalid postal code format.")
  private String postalCode;

  private String facebookLink;

  private String instagramLink;

  private String twitterLink;

  private String youtubeLink;
}

