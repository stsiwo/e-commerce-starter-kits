package com.iwaodev.application.dto.user;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddressDTO {

  private Long addressId;

  private String address1;

  private String address2;

  private String city;

  private String province;

  private String country;

  private String postalCode;

  private Boolean isBillingAddress;

  private Boolean isShippingAddress;

  private UUID userId;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

}
