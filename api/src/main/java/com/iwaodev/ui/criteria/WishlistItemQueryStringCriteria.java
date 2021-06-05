package com.iwaodev.ui.criteria;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
public class WishlistItemQueryStringCriteria {

  private UUID userId;

  private String searchQuery;

  private Double reviewPoint;

  private BigDecimal minPrice;

  private BigDecimal maxPrice;

  private Boolean isDiscount;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime startDate;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime endDate;

}



