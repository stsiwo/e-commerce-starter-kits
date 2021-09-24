package com.iwaodev.application.dto.order;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderAddressDTO {

  private String orderAddressId;

  private String address1;

  private String address2;

  private String city;

  private String province;

  private String country;

  private String postalCode;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  private Long version;
}

