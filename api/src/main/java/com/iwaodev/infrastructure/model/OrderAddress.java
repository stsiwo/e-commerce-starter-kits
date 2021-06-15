package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

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
  @Id
  @Setter(value = AccessLevel.NONE)
  @Column(name = "order_address_id")
  private String orderAddressId;

  @Column(name="address_1")
  private String address1;

  @Column(name="address_2")
  private String address2;

  @Column(name="city")
  private String city;

  @Column(name="province")
  private String province;

  @Column(name="country")
  private String country; // is there any type for country like Locale

  @Column(name="postal_code")
  private String postalCode;

  @CreationTimestamp
  @Column(name="created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name="updated_at")
  private LocalDateTime updatedAt;

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


}


