package com.iwaodev.ui.criteria.review;

import java.util.UUID;

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
public class ReviewCriteria {

  private Long reviewId;
  
  @NotEmpty(message = "review name can not be null.")
  private String reviewTitle;

  @NotNull(message = "review point can not be null.")
  private Double reviewPoint;

  @NotEmpty(message = "review description can not be null.")
  private String reviewDescription;

  private Boolean isVerified;

  private String note;

  private UUID productId;

  private UUID userId;
}


