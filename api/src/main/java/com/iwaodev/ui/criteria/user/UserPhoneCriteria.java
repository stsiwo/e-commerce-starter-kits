package com.iwaodev.ui.criteria.user;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Pattern;

import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class UserPhoneCriteria {

  @Null(message = "{phone.id.null}", groups = OnCreate.class)
  @NotNull(message = "{phone.id.notnull}", groups = OnUpdate.class)
  private Long phoneId;
  
  @Pattern( regexp = "^[0-9]{10}$", message = "{phone.phoneNumber.invalidformat}")
  private String phoneNumber;

  /**
   * disable temporary since no requirement.
   **/
  //@Size(min = 4, max = 4)
  //private String extension;

  @Pattern( regexp = "^(\\+?\\d{1,3}|\\d{1,4})$", message = "{phone.countryCode.invalidformat}")
  private String countryCode;

  private Boolean isSelected;


  private Long version;
}

