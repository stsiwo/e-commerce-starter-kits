package com.iwaodev.application.dto.product;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
public class ProductImageDTO {
  private Long productImageId;
  private String productImagePath;
  private Boolean isChange;
  private String productImageName;

  private Long version;
}

