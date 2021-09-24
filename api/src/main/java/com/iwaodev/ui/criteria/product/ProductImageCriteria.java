package com.iwaodev.ui.criteria.product;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class ProductImageCriteria {

  @Null(message = "{productImage.id.null}", groups = OnCreate.class)
  @NotNull(message = "{productImage.id.notnull}", groups = OnUpdate.class)
  private Long productImageId;

  // null if empty
  private String productImagePath;

  @NotNull(message = "{productImage.isChange.notnull}")
  private Boolean isChange;

  @NotEmpty(message = "{productImage.productImageName.notempty}")
  private String productImageName;

  private Long version;
}



