package com.iwaodev.infrastructure.model;

import javax.persistence.*;
import javax.validation.constraints.*;

import com.iwaodev.infrastructure.model.listener.CompanyValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.sql.Timestamp;

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

  @NotEmpty(message = "{company.companyName.notempty}")
  @Size(max = 100, message = "{company.companyName.max100}")
  @Column(name="company_name")
  private String companyName;

  @NotEmpty(message = "{company.companyDescription.notempty}")
  @Size(max = 10000, message = "{company.companyDescription.max10000}")
  @Column(name="company_description")
  private String companyDescription;

  @NotEmpty(message = "{company.companyEmail.notempty}")
  @Email(message = "{company.companyEmail.invalidformat}")
  @Size(max = 100, message = "{company.companyEmail.max100}")
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
  @Size(max = 100, message = "{address.address1.max100}")
  @Column(name="address_1")
  private String address1;

  @Size(max = 100, message = "{address.address2.max100}")
  @Column(name="address_2")
  private String address2;

  @NotEmpty(message = "{address.city.notempty}")
  @Size(max = 100, message = "{address.city.max100}")
  @Column(name="city")
  private String city;

  @NotEmpty(message = "{address.province.notempty}")
  @Size(max = 100, message = "{address.province.max100}")
  @Column(name="province")
  private String province;

  @NotEmpty(message = "{address.country.notempty}")
  @Size( max = 2, min = 2, message = "{address.country.size2}")
  // store country code (2 char) for shipping api (Canada Post)
  @Column(name="country")
  private String country; // is there any type for country like Locale

  @NotEmpty(message = "{address.postalCode.notempty}")
  @Pattern( regexp = "^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$", message = "{address.postalCode.invalidformat}")
  @Size(max = 20, message = "{address.postalCode.max20}")
  @Column(name="postal_code")
  private String postalCode;

  @Pattern( regexp = "((https?):\\/\\/)?(www.)?[a-z0-9]+(\\.[a-z]{2,}){1,3}(#?\\/?[a-zA-Z0-9#]+)*\\/?(\\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$", message = "{link.facebook.invalidformat}")
  @Size(max = 100, message = "{link.facebook.max100}")
  @Column(name="facebook_link")
  private String facebookLink;

  @Pattern( regexp = "((https?):\\/\\/)?(www.)?[a-z0-9]+(\\.[a-z]{2,}){1,3}(#?\\/?[a-zA-Z0-9#]+)*\\/?(\\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$", message = "{link.instagram.invalidformat}")
  @Size(max = 100, message = "{link.instagram.max100}")
  @Column(name="instagram_link")
  private String instagramLink;

  @Pattern( regexp = "((https?):\\/\\/)?(www.)?[a-z0-9]+(\\.[a-z]{2,}){1,3}(#?\\/?[a-zA-Z0-9#]+)*\\/?(\\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$", message = "{link.twitter.invalidformat}")
  @Size(max = 100, message = "{link.twitter.max100}")
  @Column(name="twitter_link")
  private String twitterLink;

  @Pattern( regexp = "((https?):\\/\\/)?(www.)?[a-z0-9]+(\\.[a-z]{2,}){1,3}(#?\\/?[a-zA-Z0-9#]+)*\\/?(\\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$", message = "{link.youtube.invalidformat}")
  @Size(max = 100, message = "{link.youtube.max100}")
  @Column(name="youtube_link")
  private String youtubeLink;

  @Version
  @Column(name = "version")
  private Long version = 0L;

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

  public void update(Company newCompany) {
    this.companyName = newCompany.getCompanyName();
    this.companyDescription = newCompany.getCompanyDescription();
    this.companyEmail = newCompany.getCompanyEmail();
    this.phoneNumber = newCompany.getPhoneNumber();
    this.countryCode = newCompany.getCountryCode();
    this.address1 = newCompany.getAddress1();
    this.address2 = newCompany.getAddress2();
    this.city = newCompany.getCity();
    this.province = newCompany.getProvince();
    this.country = newCompany.getCountry();
    this.postalCode = newCompany.getPostalCode();
    this.facebookLink = newCompany.getFacebookLink();
    this.instagramLink = newCompany.getInstagramLink();
    this.twitterLink = newCompany.getTwitterLink();
    this.youtubeLink = newCompany.getYoutubeLink();
  }
}
