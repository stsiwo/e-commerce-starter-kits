package com.iwaodev.application.dto.category;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Data
@ToString
public class ProductDTO {

  private UUID productId;

  private String productName;

  private String productDescription;

  private String productPath;

  private BigDecimal productBaseUnitPrice;

  private BigDecimal productBaseDiscountPrice;

  private LocalDateTime productBaseDiscountStartDate;

  private LocalDateTime productBaseDiscountEndDate;

  private Double averageReviewPoint;

  private Boolean isDiscount;

  private Boolean isPublic;

  private LocalDateTime releaseDate;

  private String note;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  private CategoryDTO category;

  private List<ProductVariantDTO> variants;

  private List<ProductImageDTO> productImages;

  private Long version;
}

