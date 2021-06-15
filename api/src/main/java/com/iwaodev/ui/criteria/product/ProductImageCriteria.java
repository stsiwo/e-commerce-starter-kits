package com.iwaodev.ui.criteria.product;

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
public class ProductImageCriteria {

  private Long productImageId;

  private String productImagePath;

  @NotNull(message = "isChange can not be null.")
  private Boolean isChange;

  @NotEmpty(message = "product image name can not be empty.")
  private String productImageName;
}



