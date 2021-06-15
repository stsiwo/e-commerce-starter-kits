package com.iwaodev.ui.criteria.order;

import java.util.UUID;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

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
public class OrderDetailCriteria {

  // nullable for new order use case
  private String orderDetailId;

  @NotNull(message = "product quantity can not be null.")
  @Min(value = 1, message = "The value must be greater than or equal 1")
  private Integer productQuantity;

  @NotNull(message = "product id can not be null.")
  private UUID productId;

  @NotNull(message = "product variant id can not be null.")
  private Long productVariantId;

}


