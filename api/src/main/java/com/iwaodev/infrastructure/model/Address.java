package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@Entity(name="addresses")
public class Address {

  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="address_id")
  private Long addressId;

  @Column(name="address_1")
  private String address1;

  @Column(name="address_2")
  private String address2;

  @Column(name="city")
  private String city;

  @Column(name="province")
  private String province;

  // store country code (2 char) for shipping api (Canada Post)
  @Column(name="country")
  private String country; // is there any type for country like Locale

  @Column(name="postal_code")
  private String postalCode;

  @Column(name="is_billing_address")
  private Boolean isBillingAddress;

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


