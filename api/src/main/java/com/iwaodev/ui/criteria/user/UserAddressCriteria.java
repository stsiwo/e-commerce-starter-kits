package com.iwaodev.ui.criteria.user;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

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
  
  @Null(message = "{address.id.null}", groups = OnCreate.class)
  @NotNull(message = "{address.id.notnull}", groups = OnUpdate.class)
  private Long addressId;

  @NotEmpty(message = "{address.address1.notempty}")
  private String address1;

  private String address2;

  @NotEmpty(message = "{address.city.notempty}")
  private String city;

  @NotEmpty(message = "{address.province.notempty}")
  private String province;

  @NotEmpty(message = "{address.country.notempty}")
  @Size( max = 2, min = 2, message = "{address.country.size2}")
  private String country;

  @NotEmpty(message = "{address.postalCode.notempty}")
  @Pattern( regexp = "^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$", message = "{address.postalCode.invalidformat}")
  private String postalCode;

  private Boolean isBillingAddress;

  private Boolean isShippingAddress;
}
