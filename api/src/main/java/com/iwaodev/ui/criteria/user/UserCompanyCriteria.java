package com.iwaodev.ui.criteria.user;

import javax.validation.constraints.*;

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

  @NotEmpty(message = "{company.companyName.notempty}")
  @Size(max = 100, message = "{company.companyName.max100}")
  private String companyName;

  @NotEmpty(message = "{company.companyDescription.notempty}")
  @Size(max = 10000, message = "{company.companyDescription.max10000}")
  private String companyDescription;

  @NotEmpty(message = "{company.companyEmail.notempty}")
  @Email(message = "{company.companyEmail.invalidformat}")
  @Size(max = 100, message = "{company.companyEmail.max100}")
  private String companyEmail;

  @NotEmpty(message = "{phone.phoneNumber.notempty}")
  @Pattern( regexp = "^[0-9]{10}$", message = "{phone.phoneNumber.invalidformat}")
  private String phoneNumber;

  @NotEmpty(message = "{phone.countryCode.notempty}")
  @Pattern( regexp = "^(\\+?\\d{1,3}|\\d{1,4})$", message = "{phone.countryCode.invalidformat}")
  private String countryCode;

  @NotEmpty(message = "{address.address1.notempty}")
  @Size(max = 100, message = "{address.address1.max100}")
  private String address1;

  @Size(max = 100, message = "{address.address2.max100}")
  private String address2;

  @NotEmpty(message = "{address.city.notempty}")
  @Size(max = 100, message = "{address.city.max100}")
  private String city;

  @NotEmpty(message = "{address.province.notempty}")
  @Size(max = 100, message = "{address.province.max100}")
  private String province;

  @Size( max = 2, min = 2, message = "{address.country.size2}")
  @NotEmpty(message = "{address.country.notempty}")
  private String country;

  @NotEmpty(message = "{address.postalCode.notempty}")
  @Pattern( regexp = "^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$", message = "{address.postalCode.invalidformat}")
  @Size(max = 20, message = "{address.postalCode.max20}")
  private String postalCode;

  @Pattern( regexp = "((https?):\\/\\/)?(www.)?[a-z0-9]+(\\.[a-z]{2,}){1,3}(#?\\/?[a-zA-Z0-9#]+)*\\/?(\\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$", message = "{link.facebook.invalidformat}")
  @Size(max = 100, message = "{link.facebook.max100}")
  private String facebookLink;

  @Pattern( regexp = "((https?):\\/\\/)?(www.)?[a-z0-9]+(\\.[a-z]{2,}){1,3}(#?\\/?[a-zA-Z0-9#]+)*\\/?(\\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$", message = "{link.instagram.invalidformat}")
  @Size(max = 100, message = "{link.instagram.max100}")
  private String instagramLink;

  @Pattern( regexp = "((https?):\\/\\/)?(www.)?[a-z0-9]+(\\.[a-z]{2,}){1,3}(#?\\/?[a-zA-Z0-9#]+)*\\/?(\\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$", message = "{link.twitter.invalidformat}")
  @Size(max = 100, message = "{link.twitter.max100}")
  private String twitterLink;

  @Pattern( regexp = "((https?):\\/\\/)?(www.)?[a-z0-9]+(\\.[a-z]{2,}){1,3}(#?\\/?[a-zA-Z0-9#]+)*\\/?(\\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$", message = "{link.youtube.invalidformat}")
  @Size(max = 100, message = "{link.youtube.max100}")
  private String youtubeLink;

  private Long version;
}

