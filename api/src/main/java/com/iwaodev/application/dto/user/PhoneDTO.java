package com.iwaodev.application.dto.user;

import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PhoneDTO {

  private Long phoneId;

  private String phoneNumber;

  //private String extension;

  private String countryCode;

  private Boolean isSelected;

  private UUID userId;

  private Long version;

}
