package com.iwaodev.ui.criteria.review;

import java.time.LocalDateTime;
import java.util.UUID;

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

  private Double reviewPoint;

  private Boolean isVerified;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime startDate;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime endDate;

  private UUID userId;

  private UUID productId;

}


