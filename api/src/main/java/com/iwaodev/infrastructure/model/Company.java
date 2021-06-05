package com.iwaodev.infrastructure.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@Entity(name="companies")
public class Company {

  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="company_id")
  private Long companyId;

  @Column(name="company_name")
  private String companyName;

  @Column(name="company_description")
  private String companyDescription;

  @Column(name="company_email")
  private String companyEmail;

  @Column(name="phone_number")
  private String phoneNumber;

  @Column(name="country_code")
  private String countryCode;

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

  @ManyToOne
	@JoinColumn(
    name = "user_id", 
    foreignKey = @ForeignKey(name = "FK_addresses_users"),
    insertable = true,
    updatable = true
    )
  private User user;
}


