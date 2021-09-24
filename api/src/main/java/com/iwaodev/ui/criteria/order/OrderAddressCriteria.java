package com.iwaodev.ui.criteria.order;

import javax.validation.constraints.*;

import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

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
  @Null(message = "{address.id.null}", groups = OnCreate.class)
  @NotNull(message = "{address.id.notnull}", groups = OnUpdate.class)
  private Long addressId;

  @NotEmpty(message = "{address.address1.notempty}")
  @Size(max = 100, message = "{address.address1.max100}")
  private String address1;

  @Size(max = 100, message = "{address.address2.max100}")
  private String address2;

  @NotEmpty(message = "{address.city.notempty}")
  @Size(max = 100, message = "{address.city.max100}")
  private String city;

  @NotEmpty(message = "{address.province.notempty}")
  @Size(max = 100, message = "{address.province.max100}")
  private String province;

  @NotEmpty(message = "{address.country.notempty}")
  @Size( max = 2, min = 2, message = "{address.country.size2}")
  private String country;

  @NotEmpty(message = "{address.postalCode.notempty}")
  @Pattern( regexp = "^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$", message = "{address.postalCode.invalidformat}")
  @Size(max = 20, message = "{address.postalCode.max20}")
  private String postalCode;

  private Long version;
}

