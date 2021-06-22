package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.iwaodev.infrastructure.model.listener.AddressValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@EntityListeners(AddressValidationListener.class)
@Entity(name="addresses")
public class Address {

  @Null(message = "{address.id.null}", groups = OnCreate.class)
  @NotNull(message = "{address.id.notnull}", groups = OnUpdate.class)
  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="address_id")
  private Long addressId;

  @NotEmpty(message = "{address.address1.notempty}")
  @Column(name="address_1")
  private String address1;

  @Column(name="address_2")
  private String address2;

  @NotEmpty(message = "{address.city.notempty}")
  @Column(name="city")
  private String city;

  @NotEmpty(message = "{address.province.notempty}")
  @Column(name="province")
  private String province;

  @NotEmpty(message = "{address.country.notempty}")
  @Size( max = 2, min = 2, message = "{address.country.size2}")
  @Column(name="country")
  private String country; 

  @NotEmpty(message = "{address.postalCode.notempty}")
  @Pattern( regexp = "^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$", message = "{address.postalCode.invalidformat}")
  @Column(name="postal_code")
  private String postalCode;

  @NotNull(message = "{address.isBillingAddress.notnull}")
  @Column(name="is_billing_address")
  private Boolean isBillingAddress;

  @NotNull(message = "{address.isShippingAddress.notnull}")
  @Column(name="is_shipping_address")
  private Boolean isShippingAddress;

  @CreationTimestamp
  @Column(name="created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name="updated_at")
  private LocalDateTime updatedAt;

  @ManyToOne
	@JoinColumn(
    name = "user_id", 
    foreignKey = @ForeignKey(name = "FK_addresses_users"),
    insertable = true,
    updatable = false
    )
  private User user;
}


