package com.iwaodev.application.dto.cartItem;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.iwaodev.domain.user.UserActiveEnum;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Data
@ToString
public class UserDTO {

  private UUID userId;

  private String firstName;

  private String lastName;

  private String email;

  private String avatarImagePath;

  private UserTypeDTO userType;

  private UserActiveEnum active;

  private Long version;
}


