package com.iwaodev.ui.criteria.user;

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

  private Long version;
}
