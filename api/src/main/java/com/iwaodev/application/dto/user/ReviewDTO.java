package com.iwaodev.application.dto.user;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReviewDTO {

  private Long reviewId;

  private Double reviewPoint;

  private String reviewTitle;

  private String reviewDescription;

  private String isVerified;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  private Long version;
  // #TODO: need to include product
}
