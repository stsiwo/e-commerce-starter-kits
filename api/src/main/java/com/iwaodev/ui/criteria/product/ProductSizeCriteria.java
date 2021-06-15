package com.iwaodev.ui.criteria.product;

import javax.validation.constraints.NotEmpty;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class ProductSizeCriteria {

  private Long productSizeId;

  @NotEmpty(message = "product size name must not be null.")
  private String productSizeName;

  private String productSizeDescription;
}



