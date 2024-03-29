package com.iwaodev.application.dto.wishlistItem;

import com.iwaodev.application.dto.product.ProductDTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@NoArgsConstructor
@Data
@ToString
public class WishlistItemDTO {

  private Long wishlistItemId;

  private UserDTO user;

  private ProductDTO product;

  private LocalDateTime createdAt;

  private Long version;
}


