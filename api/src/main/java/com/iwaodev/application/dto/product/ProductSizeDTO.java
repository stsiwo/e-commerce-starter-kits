package com.iwaodev.application.dto.product;

import javax.validation.constraints.NegativeOrZero;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
public class ProductSizeDTO {
  private Long productSizeId;
  private String productSizeName;
  private String productSizeDescription;

  private Long version;
}
