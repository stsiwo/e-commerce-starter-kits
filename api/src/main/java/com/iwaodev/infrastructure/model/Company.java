package com.iwaodev.infrastructure.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Pattern;

import com.iwaodev.infrastructure.model.listener.CompanyValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@EntityListeners(CompanyValidationListener.class)
@Entity(name="companies")
public class Company {

  @Null(message = "{company.id.null}", groups = OnCreate.class)
  @NotNull(message = "{company.id.notnull}", groups = OnUpdate.class)
  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="company_id")
  private Long companyId;

  @NotEmpty(message = "{company.name.notempty}")
  @Column(name="company_name")
  private String companyName;

  @NotEmpty(message = "{company.description.notempty}")
  @Column(name="company_description")
  private String companyDescription;

  @NotEmpty(message = "{company.email.notempty}")
  @Email(message = "{company.email.invalidformat}")
  @Column(name="company_email")
  private String companyEmail;

  @NotEmpty(message = "{phone.phoneNumber.notempty}")
  @Pattern( regexp = "^[0-9]{10}$", message = "{phone.phoneNumber.invalidformat}")
  @Column(name="phone_number")
  private String phoneNumber;

  @NotEmpty(message = "{phone.countryCode.notempty}")
  @Pattern( regexp = "^(\\+?\\d{1,3}|\\d{1,4})$", message = "{phone.countryCode.invalidformat}")
  @Column(name="country_code")
  private String countryCode;

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
  // store country code (2 char) for shipping api (Canada Post)
  @Column(name="country")
  private String country; // is there any type for country like Locale

  @NotEmpty(message = "{address.postalCode.notempty}")
  @Pattern( regexp = "^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$", message = "{address.postalCode.invalidformat}")
  @Column(name="postal_code")
  private String postalCode;

  @NotNull(message = "{company.user.notnull}")
  @ManyToOne
	@JoinColumn(
    name = "user_id", 
    foreignKey = @ForeignKey(name = "FK_addresses_users"),
    insertable = true,
    updatable = true
    )
  private User user;

  /**
   * extract domain from companyEmail field.
   **/
  public String getDomain() {
    return this.companyEmail.substring(this.companyEmail.indexOf("@") + 1);
  }
}


