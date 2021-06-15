package com.iwaodev.ui.criteria.user;

import java.util.UUID;

import javax.validation.constraints.NotNull;

import com.iwaodev.domain.user.UserActiveEnum;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class UserStatusCriteria {

  @NotNull(message = "user id can not be null.")
  private UUID userId;
  
  @NotNull(message = "active status can not be null.")
  private UserActiveEnum active;

  private String activeNote;
}

