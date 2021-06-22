package com.iwaodev.ui.criteria.cartItem;

import java.util.UUID;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class CartItemCriteria {

  @Null(message = "{cartItem.id.null}", groups = OnCreate.class)
  @NotNull(message = "{cartItem.id.notnull}", groups = OnUpdate.class)
  private Long cartItemId;

  @NotNull(message = "{cartItem.user.notnull}")
  private UUID userId; 
  
  @NotNull(message = "{cartItem.variant.notnull}")
  private Long variantId;

  private Boolean isSelected;

  @NotNull(message = "{cartItem.quantity.notnull}")
  @Min(value = 1, message = "{cartItem.quantity.min1}")
  private Integer quantity;
}


