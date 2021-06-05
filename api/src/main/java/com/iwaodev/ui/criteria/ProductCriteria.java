package com.iwaodev.ui.criteria;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.validation.Valid;
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
public class ProductCriteria {

  private UUID productId;
  
  @NotEmpty(message = "product name must not be null.")
  private String productName;

  @NotEmpty(message = "product description must not be null.")
  private String productDescription;

  @NotEmpty(message = "product path must not be null.")
  private String productPath;

  @NotNull(message = "product base unit price must not be null.")
  private BigDecimal productBaseUnitPrice;

  private BigDecimal productBaseDiscountPrice;

  private LocalDateTime productBaseDiscountStartDate;

  private LocalDateTime productBaseDiscountEndDate;

  private Boolean isDiscount;

  private Boolean isPublic;

  @Valid 
  private List<ProductImageCriteria> productImages;

  @Valid 
  private CategoryCriteria category;

  private LocalDateTime releaseDate;
  
  private String note;

  @Valid
  private List<ProductVariantCriteria> variants = new ArrayList<>();
}

