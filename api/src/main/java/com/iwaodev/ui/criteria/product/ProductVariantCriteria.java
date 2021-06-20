package com.iwaodev.ui.criteria.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.domain.product.validator.VariantColorAndSizeUnique;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;
import com.iwaodev.ui.validator.optional.digit.OptionalDigit;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@VariantColorAndSizeUnique()
@ToString
@Data
@NoArgsConstructor
@Validated
public class ProductVariantCriteria {

  @Null(message = "{productVariant.id.null}", groups = OnCreate.class)
  @NotNull(message = "{productVariant.id.notnull}", groups = OnUpdate.class)
  private Long variantId;

  @OptionalDigit(integer = 6, fraction = 2, message = "{productVariant.variantUnitPrice.invalidformat}")
  private BigDecimal variantUnitPrice;

  @OptionalDigit(integer = 6, fraction = 2, message = "{productVariant.variantDiscountPrice.invalidformat}")
  private BigDecimal variantDiscountPrice;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime variantDiscountStartDate;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime variantDiscountEndDate;

  @NotNull(message = "{productVariant.variantStock.notnull}")
  @Min(value = 0, message = "{productVariant.variantStock.min0}")
  private Integer variantStock;

  @NotNull(message = "{productVariant.isDiscount.notnull}")
  private Boolean isDiscount;

  private String note;

  @NotEmpty(message = "{productVariant.variantColor.notempty}")
  private String variantColor;

  @Valid
  @NotNull(message = "{productVariant.productSize.notnull}")
  private ProductSizeCriteria productSize;

  @NotNull(message = "{productVariant.variantWeight.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantWeight.notnull}")
  private Double variantWeight;

  @NotNull(message = "{productVariant.variantHeight.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantHeight.notnull}")
  private Double variantHeight;

  @NotNull(message = "{productVariant.variantLength.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantLength.notnull}")
  private Double variantWidth;

  @NotNull(message = "{productVariant.variantWidth.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantWidth.notnull}")
  private Double variantLength;
}


