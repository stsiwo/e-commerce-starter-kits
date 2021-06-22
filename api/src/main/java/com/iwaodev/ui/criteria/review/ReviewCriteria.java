package com.iwaodev.ui.criteria.review;

import java.util.UUID;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;
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
public class ReviewCriteria {

  @Null(message = "{review.id.null}", groups = OnCreate.class)
  @NotNull(message = "{review.id.notnull}", groups = OnUpdate.class)
  private Long reviewId;
  
  @NotEmpty(message = "{review.title.notempty}")
  private String reviewTitle;

  @NotNull(message = "{review.point.notnull}")
  @DecimalMin(value = "0.0", message = "{review.point.min0}")
  @DecimalMax(value = "5.0", message = "{review.point.max5}")
  private Double reviewPoint;

  @NotEmpty(message = "{review.descripiton.notempty}")
  private String reviewDescription;

  private Boolean isVerified;

  private String note;

  @NotNull(message = "{review.product.notnull}")
  private UUID productId;

  @NotNull(message = "{review.user.notnull}")
  private UUID userId;
}


