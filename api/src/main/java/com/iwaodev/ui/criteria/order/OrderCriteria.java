package com.iwaodev.ui.criteria.order;

import java.util.List;
import java.util.UUID;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Pattern;

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
public class OrderCriteria {

  /**
   * don't need orderId. since we not gonna update.
   **/
  @NotNull(message = "{order.id.notnull}", groups = OnUpdate.class)
  @Null(message = "{order.id.null}", groups = OnCreate.class)
  private UUID orderId;

  /**
   * any cost (e.g., price should be determined by server-side and don't accept the price from untrusted place (e.g., front-end)
   **/
  private String note;

  @NotEmpty(message = "{order.orderFirstName.notempty}")
  private String orderFirstName;

  @NotEmpty(message = "{order.orderLastName.notempty}")
  private String orderLastName;

  @NotEmpty(message = "{order.email.notempty}")
  @Email(message = "{order.email.invalidformat}")
  private String orderEmail;

  @NotEmpty(message = "{order.orderPhone.notempty}")
  @Pattern( regexp = "^\\+(?:[0-9] ?){6,14}[0-9]$", message = "{order.orderPhone.invalidformat}")
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


