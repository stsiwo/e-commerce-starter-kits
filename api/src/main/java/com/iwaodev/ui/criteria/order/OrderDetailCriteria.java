package com.iwaodev.ui.criteria.order;

import java.util.UUID;

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

  @NotNull(message = "product quantity must not be null.")
  private Integer productQuantity;

  @NotNull(message = "product id must not be null.")
  private UUID productId;

  @NotNull(message = "product variant id must not be null.")
  private Long productVariantId;

}

