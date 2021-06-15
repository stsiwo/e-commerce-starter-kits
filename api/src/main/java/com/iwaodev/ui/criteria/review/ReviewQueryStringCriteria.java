package com.iwaodev.ui.criteria.review;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
public class ReviewQueryStringCriteria {

  /**
   * user name, user email, product name, product desc, review title, review desc
   **/
  private String searchQuery;

  @Min(value = 0, message = "The review point must be greater than or equal 0")
  @Max(value = 5, message = "The review point must be less than or equal 5")
  private Double reviewPoint;

  private Boolean isVerified;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime startDate;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime endDate;

  private UUID userId;

  private UUID productId;

}


