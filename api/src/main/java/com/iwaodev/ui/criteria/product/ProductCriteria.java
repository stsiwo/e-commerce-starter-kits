package com.iwaodev.ui.criteria.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.iwaodev.ui.criteria.category.CategoryCriteria;
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
public class ProductCriteria {

  private UUID productId;
  
  @NotEmpty(message = "product name can not be null.")
  private String productName;

  @NotEmpty(message = "product description can not be null.")
  private String productDescription;

  @NotEmpty(message = "product path can not be null.")
  private String productPath;

  @NotNull(message = "product base unit price can not be null.")
  @Min(value = 1, message = "the price must be greater than or equal 1.00")
  private BigDecimal productBaseUnitPrice;

  @OptionalDigit(integer = 6, fraction = 2, message = "optional but if you specifiy, must be greater than or equal to 1.00")
  private BigDecimal productBaseDiscountPrice;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime productBaseDiscountStartDate;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime productBaseDiscountEndDate;

  private Boolean isDiscount;

  private Boolean isPublic;

  @Valid 
  private List<ProductImageCriteria> productImages;

  @Valid 
  private CategoryCriteria category;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime releaseDate;
  
  private String note;

  @Valid
  private List<ProductVariantCriteria> variants = new ArrayList<>();
}

