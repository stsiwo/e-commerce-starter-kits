package com.iwaodev.ui.criteria;

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
  private String phoneNumber;

  /**
   * disable temporary since no requirement.
   **/
  //@Size(min = 4, max = 4)
  //private String extension;

  /**
   * internal prefix validation regex
   **/
  @Pattern(
    regexp = "^(\\+?\\d{1,3}|\\d{1,4})$",
    message = "phone number must be valid format"
  )
  private String countryCode;

  private Boolean isSelected;
}

