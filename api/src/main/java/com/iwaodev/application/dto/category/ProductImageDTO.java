package com.iwaodev.application.dto.category;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
public class ProductImageDTO {
  private Long productImageId;
  private String productImagePath;

  private Long version;
}

