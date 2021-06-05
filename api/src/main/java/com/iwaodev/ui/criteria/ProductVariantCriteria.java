package com.iwaodev.ui.criteria;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class ProductVariantCriteria {

  private Long variantId;

  private BigDecimal variantUnitPrice;

  private BigDecimal variantDiscountPrice;

  private LocalDateTime variantDiscountStartDate;

  private LocalDateTime variantDiscountEndDate;

  @NotNull(message = "product variant stock must not be null.")
  private Integer variantStock;

  private Boolean isDiscount;

  private String note;

  @NotEmpty(message = "product color must not be null.")
  private String variantColor;

  @Valid
  private ProductSizeCriteria productSize;

  private Double variantWeight;

  private Double variantHeight;

  private Double variantWidth;

  private Double variantLength;
}


