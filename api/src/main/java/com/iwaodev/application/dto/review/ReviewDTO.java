package com.iwaodev.application.dto.review;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Data
@ToString
public class ReviewDTO {

  private Long reviewId;

  private String reviewTitle;

  private String reviewDescription;

  private Double reviewPoint;

  private Boolean isVerified;

  private String note;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  private UserDTO user;

  private ProductDTO product;

  private Long version;
}


