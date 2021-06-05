package com.iwaodev.ui.criteria;

import java.util.UUID;

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

  @NotNull(message = "user id must not be null.")
  private UUID userId; 
  
  @NotNull(message = "variant id name must not be null.")
  private Long variantId;

  private Boolean isSelected;

  @NotNull(message = "quantity must not be null.")
  private Integer quantity;

}


