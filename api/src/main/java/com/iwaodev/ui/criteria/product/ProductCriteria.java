package com.iwaodev.ui.criteria.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.validation.Valid;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;
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

  @Null(message = "{product.id.null}", groups = OnCreate.class)
  @NotNull(message = "{product.id.notnull}", groups = OnUpdate.class)
  private UUID productId;
  
  @NotEmpty(message = "{product.productName.notempty}")
  private String productName;

  @NotEmpty(message = "{product.productDescription.notempty}")
  private String productDescription;

  @NotEmpty(message = "{product.productPath.notempty}")
  private String productPath;

  @NotNull(message = "{product.productBaseUnitPrice.notnull}")
  @DecimalMin(value = "1.0", message = "{product.productBaseUnitPrice.min1}")
  private BigDecimal productBaseUnitPrice;

  @OptionalDigit(integer = 6, fraction = 2, message = "optional but if you specifiy, must be greater than or equal to 1.00")
  private BigDecimal productBaseDiscountPrice;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime productBaseDiscountStartDate;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime productBaseDiscountEndDate;

  @NotNull(message = "{product.isDiscount.notnull}")
  private Boolean isDiscount;

  @NotNull(message = "{product.isPublic.notnull}")
  private Boolean isPublic;

  @Valid 
  // this does not work. even if this is not null, it will complain about it is null.
  //@NotNull(message = "{product.productImages.notnull}")
  private List<ProductImageCriteria> productImages;

  @Valid 
  @NotNull(message = "{product.category.notnull}")
  private CategoryCriteria category;

  @NotNull(message = "{product.releaseDate.notnull}")
  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime releaseDate;
  
  private String note;

  @Valid
  private List<ProductVariantCriteria> variants = new ArrayList<>();
}

