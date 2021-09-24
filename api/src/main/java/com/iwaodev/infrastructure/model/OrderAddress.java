package com.iwaodev.infrastructure.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.*;
import javax.validation.constraints.*;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import com.iwaodev.infrastructure.model.listener.OrderAddressValidationListener;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;
import lombok.ToString;

@Data
@ToString
@EntityListeners(OrderAddressValidationListener.class)
@Entity(name = "orderAddresses")
public class OrderAddress {

  /**
   * use nanoId
   **/
  @NotNull(message = "{address.id.notnull}")
  @Id
  @Setter(value = AccessLevel.NONE)
  @Column(name = "order_address_id")
  private String orderAddressId;

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
  @Column(name="country")
  private String country; // is there any type for country like Locale

  @NotEmpty(message = "{address.postalCode.notempty}")
  @Pattern( regexp = "^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$", message = "{address.postalCode.invalidformat}")
  @Size(max = 20, message = "{address.postalCode.max20}")
  @Column(name="postal_code")
  private String postalCode;

  @CreationTimestamp
  @Column(name="created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name="updated_at")
  private LocalDateTime updatedAt;

  @Version
  @Column(name = "version")
  private Long version = 0L;

  public OrderAddress() {
    // explicitly assign id and stop using auto generated id because of order-orderaddress association (its reserverd).
    this.orderAddressId = NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR, NanoIdUtils.DEFAULT_ALPHABET, 11);
  }

  /**
   * issue: how to deal with multiple properties which points to the same another entity. like this case.
   *
   * solution: just change the name like below. 
   *
   *  ref: https://stackoverflow.com/questions/21345203/multiple-manytoone-fields-pointing-to-same-entity-in-jpa-hibernate
   *
   * - you still assign id explicitly even if you did this.
   *
   **/
  @OneToOne
  @JoinColumn(name = "shipping_order_id", nullable = true)
  private Order shippingOrder;

  @OneToOne
  @JoinColumn(name = "billing_order_id", nullable = true)
  private Order billingOrder;

  public String displayAddress() {
    return String.format("%s %s %s %s %s %s", this.address1, this.address2, this.city, this.province, this.country, this.postalCode);
  }


}


