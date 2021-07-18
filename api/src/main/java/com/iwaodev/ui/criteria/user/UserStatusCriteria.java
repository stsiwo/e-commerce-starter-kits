package com.iwaodev.ui.criteria.user;

import java.util.UUID;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

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

  @NotNull(message = "{user.id.notnull}")
  private UUID userId;
  
  @NotNull(message = "{user.active.notnull}")
  private UserActiveEnum active;

  @Size(max = 1000, message = "{user.activeNote.max1000}")
  private String activeNote;
}

