package com.iwaodev.ui.criteria.order;

import java.util.UUID;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.iwaodev.infrastructure.model.validator.OnCreate;

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

  @NotNull(message = "{orderDetail.productQuantity.notnull}")
  @Min(value = 1, message = "{orderDetail.productQuantity.min1}")
  private Integer productQuantity;

  @NotNull(message = "{orderDetail.product.notnull}", groups = OnCreate.class)
  private UUID productId;

  @NotNull(message = "{orderDetail.productVariant.notnull}", groups = OnCreate.class)
  private Long productVariantId;

}


