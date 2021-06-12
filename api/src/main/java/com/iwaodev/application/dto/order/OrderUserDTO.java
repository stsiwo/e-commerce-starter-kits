package com.iwaodev.application.dto.order;

import java.time.LocalDateTime;
import java.util.UUID;

import com.iwaodev.application.dto.user.UserTypeDTO;
import com.iwaodev.domain.user.UserActiveEnum;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderUserDTO {

  private UUID userId;

  private String firstName;

  private String lastName;

  private String email;

  private String avatarImagePath;

  private UserTypeDTO userType;

  private UserActiveEnum active;

  private String activeNote;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;
}
