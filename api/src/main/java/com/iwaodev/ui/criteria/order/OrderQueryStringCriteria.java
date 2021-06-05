package com.iwaodev.ui.criteria.order;

import java.time.LocalDateTime;
import java.util.UUID;

import com.iwaodev.domain.order.OrderStatusEnum;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
public class OrderQueryStringCriteria {

  private String searchQuery;

  private OrderStatusEnum orderStatus;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime startDate;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private LocalDateTime endDate;

  private UUID userId;

}


