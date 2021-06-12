package com.iwaodev.ui.criteria;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class UserDeleteTempCriteria {

  private String activeNote;
  
}
