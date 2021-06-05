package com.iwaodev.application.dto.order;

import java.time.LocalDateTime;
import java.util.UUID;

import com.iwaodev.application.dto.user.UserTypeDTO;

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

  private Boolean isDeleted;

  private LocalDateTime deletedAccountDate;

  private String deletedAccountReason;

  private UserTypeDTO userType;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;
}
