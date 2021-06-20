package com.iwaodev.ui.criteria.order;

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

  @NotEmpty(message = "address 1 can not be null.")
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

public Long getAddressId() {
	return addressId;
}

public void setAddressId(Long addressId) {
	this.addressId = addressId;
}

public String getAddress1() {
	return address1;
}

public void setAddress1(String address1) {
	this.address1 = address1;
}

public String getAddress2() {
	return address2;
}

public void setAddress2(String address2) {
	this.address2 = address2;
}

public String getCity() {
	return city;
}

public void setCity(String city) {
	this.city = city;
}

public String getProvince() {
	return province;
}

public void setProvince(String province) {
	this.province = province;
}

public String getCountry() {
	return country;
}

public void setCountry(String country) {
	this.country = country;
}

public String getPostalCode() {
	return postalCode;
}

public void setPostalCode(String postalCode) {
	this.postalCode = postalCode;
}
}

