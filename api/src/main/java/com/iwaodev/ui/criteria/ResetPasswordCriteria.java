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
public class ResetPasswordCriteria {

  @NotEmpty(message = "password can not be null.")
  private String password;

  @NotEmpty(message = "forgot password token can not be null.")
  private String token;

}


