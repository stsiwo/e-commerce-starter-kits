package com.iwaodev.ui.criteria.order;

import java.util.List;
import java.util.UUID;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

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
public class OrderCriteria {

  /**
   * don't need orderId. since we not gonna update.
   **/
  private UUID orderId;

  /**
   * any cost (e.g., price should be determined by server-side and don't accept the price from untrusted place (e.g., front-end)
   **/
  private String note;

  @NotEmpty(message = "first name of the customer can not be null.")
  private String orderFirstName;

  @NotEmpty(message = "last name of the customer can not be null.")
  private String orderLastName;

  @NotEmpty(message = "email of the customer can not be null.")
  private String orderEmail;

  @NotEmpty(message = "phone of the customer can not be null.")
  private String orderPhone;

  @Valid
  private OrderAddressCriteria shippingAddress;

  @Valid
  private OrderAddressCriteria billingAddress;

  // MapStruct Ignore 
  // nullable for guest user, but mandatory for member user
  private UUID userId;

  // MapStruct Ignore 
  @Valid
  private List<OrderDetailCriteria> orderDetails;

  // MapStruct Ignore 
  // nullable for creating, but mandatory for updating 
  private List<Long> orderEvents;

  private String currency;

}


