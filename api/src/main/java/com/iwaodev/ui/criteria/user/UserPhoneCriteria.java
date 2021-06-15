package com.iwaodev.ui.criteria.user;

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
public class UserPhoneCriteria {

  private Long phoneId;
  
  @Size(min = 10, max = 10)
  @Pattern( regexp = "^[0-9]{10}$", message = "invalid phone number format. please enter only number without any special characater.")
  private String phoneNumber;

  /**
   * disable temporary since no requirement.
   **/
  //@Size(min = 4, max = 4)
  //private String extension;

  @Pattern( regexp = "^+(?:[0-9] ?){6,14}[0-9]$", message = "invalid phone country code format.")
  private String countryCode;

  private Boolean isSelected;
}

