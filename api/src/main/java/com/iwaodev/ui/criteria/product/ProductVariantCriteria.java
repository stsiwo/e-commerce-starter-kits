package com.iwaodev.ui.criteria.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import javax.validation.Valid;
import javax.validation.constraints.*;

import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;
import com.iwaodev.ui.validator.optional.digit.OptionalDigit;

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

  @Size(max = 10000, message = "{productVariant.note.max10000}")
  private String note;

  @NotEmpty(message = "{productVariant.variantColor.notempty}")
  private String variantColor;

  @Valid
  @NotNull(message = "{productVariant.productSize.notnull}")
  private ProductSizeCriteria productSize;

  @NotNull(message = "{productVariant.variantWeight.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantWeight.notnull}")
  @DecimalMin(value = "0.01", message = "{productVariant.variantWeight.min001}", inclusive = true)
  private Double variantWeight;

  @NotNull(message = "{productVariant.variantHeight.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantHeight.notnull}")
  @DecimalMin(value = "1.00", message = "{productVariant.variantHeight.min1}", inclusive = true)
  private Double variantHeight;

  @NotNull(message = "{productVariant.variantLength.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantLength.notnull}")
  @DecimalMin(value = "1.00", message = "{productVariant.variantLength.min1}", inclusive = true)
  private Double variantWidth;

  @NotNull(message = "{productVariant.variantWidth.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantWidth.notnull}")
  @DecimalMin(value = "1.00", message = "{productVariant.variantWidth.min1}", inclusive = true)
  private Double variantLength;

  @NotNull(message = "{productVariant.productId.notnull}")
  private UUID productId;

  private Long version;
}


