package com.iwaodev.application.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.product.ProductVariantDTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@ToString
public class OrderDetailDTO {

  private Long orderDetailId;

  private Integer productQuantity;

  private BigDecimal productUnitPrice;

  private String productColor;

  private String productSize;

  private String productName;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  // selected product which contains unselected variants too.
  private ProductDTO product;

  // selected variant
  private ProductVariantDTO productVariant;
}




