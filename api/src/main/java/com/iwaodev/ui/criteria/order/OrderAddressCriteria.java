package com.iwaodev.ui.criteria.order;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * use @NotEmpty for String type
 * use @NotNull for any other type rather than String
 * use @Valid for nested Criteria class
 **/

@ToString
@Data
@NoArgsConstructor
@Validated
public class OrderAddressCriteria {

  // nullable. use this when update
  private Long addressId;

  @NotEmpty(message = "address 1 can not be null.")
  private String address1;

  private String address2;

  @NotEmpty(message = "city can not be null.")
  private String city;

  @NotEmpty(message = "province can not be null.")
  private String province;

  @NotEmpty(message = "country can not be null.")
  @Size( max = 2, min = 2, message = "country must be exact 2 characters.")
  private String country;

  @NotEmpty(message = "postal code can not be null.")
  @Pattern( regexp = "^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$", message = "invalid postal code format.")
  private String postalCode;

}

