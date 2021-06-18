package com.iwaodev.ui.criteria.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.iwaodev.ui.validator.optional.digit.OptionalDigit;
import com.iwaodev.ui.validator.optional.doubletype.OptionalDoubleType;

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

  @OptionalDigit(integer = 6, fraction = 2, message = "optional but if you specifiy, must be greater than or equal to 1.00")
  private BigDecimal variantUnitPrice;

  @OptionalDigit(integer = 6, fraction = 2, message = "optional but if you specifiy, must be greater than or equal to 1.00")
  private BigDecimal variantDiscountPrice;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime variantDiscountStartDate;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime variantDiscountEndDate;

  @NotNull(message = "product variant stock must not be null.")
  @Min(value = 0, message = "the price must be greater than or equal 0")
  private Integer variantStock;

  private Boolean isDiscount;

  private String note;

  @NotEmpty(message = "product color must not be null.")
  private String variantColor;

  @Valid
  private ProductSizeCriteria productSize;

  @OptionalDoubleType
  private Double variantWeight;

  @OptionalDoubleType
  private Double variantHeight;

  @OptionalDoubleType
  private Double variantWidth;

  @OptionalDoubleType
  private Double variantLength;
}


