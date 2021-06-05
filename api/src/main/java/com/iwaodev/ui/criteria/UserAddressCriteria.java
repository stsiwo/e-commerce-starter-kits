package com.iwaodev.ui.criteria;

import javax.validation.constraints.NotEmpty;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class UserAddressCriteria {

  // nullable. use this when update
  private Long addressId;

  @NotEmpty(message = "address 1 must not be null.")
  private String address1;

  private String address2;

  @NotEmpty(message = "city must not be null.")
  private String city;

  @NotEmpty(message = "province must not be null.")
  private String province;

  @NotEmpty(message = "country must not be null.")
  private String country;

  @NotEmpty(message = "postal code must not be null.")
  private String postalCode;

  private Boolean isBillingAddress;

  private Boolean isShippingAddress;

  private Boolean isSenderAddress;

}
