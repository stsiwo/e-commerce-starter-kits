package com.iwaodev.application.dto.user;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.iwaodev.domain.user.UserActiveEnum;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class UserDTO {

  private UUID userId;

  private String firstName;

  private String lastName;

  private String email;

  private String avatarImagePath;

  private Boolean isDeleted;

  private LocalDateTime deletedAccountDate;

  private String deletedAccountReason;

  private UserTypeDTO userType;

  private UserActiveEnum active;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  private List<PhoneDTO> phones;

  private List<AddressDTO> addresses;

  private List<ReviewDTO> reviews;

  /**
   * should I include this orderdto also??
   *
   * need to think about transition from user page to this order page.
   *
   **/
  // private List<OrderDTO> orders;

  private List<CompanyDTO> companies;

  private LocalDateTime verificationTokenExpiryDate;

  private LocalDateTime forgotPasswordTokenExpiryDate;
}
