package com.iwaodev.ui.criteria.review;

import java.util.UUID;

import javax.validation.constraints.*;

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
  @Size(max = 500, message = "{review.title.max500}")
  private String reviewTitle;

  @NotNull(message = "{review.point.notnull}")
  @DecimalMin(value = "0.0", message = "{review.point.min0}")
  @DecimalMax(value = "5.0", message = "{review.point.max5}")
  private Double reviewPoint;

  @NotEmpty(message = "{review.reviewDescription.notempty}")
  @Size(max = 10000, message = "{review.reviewDescription.max10000}")
  private String reviewDescription;

  private Boolean isVerified;

  @Size(max = 10000, message = "{review.note.max10000}")
  private String note;

  @NotNull(message = "{review.product.notnull}")
  private UUID productId;

  @NotNull(message = "{review.user.notnull}")
  private UUID userId;
}


