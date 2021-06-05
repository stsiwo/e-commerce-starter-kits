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
public class UserCompanyCriteria {

  /**
   * for now, disable all validation since this is used for integration with postal company api (hasn't implemented yet. maybe next version).
   * 
   **/
  private Long companyId;

  private String companyName;

  private String companyDescription;

  private String companyEmail;

  private String phoneNumber;

  private String countryCode;

  private String address1;

  private String address2;

  private String city;

  private String province;

  private String country;

  private String postalCode;

}

