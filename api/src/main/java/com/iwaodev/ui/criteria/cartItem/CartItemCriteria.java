package com.iwaodev.ui.criteria.cartItem;

import java.util.UUID;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class CartItemCriteria {

  private Long cartItemId;

  @NotNull(message = "user id can not be null.")
  private UUID userId; 
  
  @NotNull(message = "variant id name can not be null.")
  private Long variantId;

  private Boolean isSelected;

  @NotNull(message = "quantity can not be null.")
  @Min(value = 1, message = "The quantity must be greater than or equal 1")
  private Integer quantity;

}


