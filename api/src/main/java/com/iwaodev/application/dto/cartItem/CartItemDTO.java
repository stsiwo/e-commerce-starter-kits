package com.iwaodev.application.dto.cartItem;

import com.iwaodev.application.dto.product.ProductDTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Data
@ToString
public class CartItemDTO {

  private Long cartItemId;

  private UserDTO user;

  private ProductDTO product;

  private Boolean isSelected;

  private Integer quantity;
}

