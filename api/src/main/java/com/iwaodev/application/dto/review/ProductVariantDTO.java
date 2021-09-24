package com.iwaodev.application.dto.review;

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
public class ProductVariantDTO {
  private Long variantId;
  private BigDecimal variantUnitPrice;
  private BigDecimal variantDiscountPrice;
  private LocalDateTime variantDiscountStartDate;
  private LocalDateTime variantDiscountEndDate;
  private Integer variantStock;
  private Boolean isDiscount;
  private Integer soldCount;
  private String note;
  private ProductSizeDTO productSize;
  private String variantColor;
  private BigDecimal currentPrice;
  private Boolean isDiscountAvailable;
  private BigDecimal regularPrice;
  private Long version;
}
