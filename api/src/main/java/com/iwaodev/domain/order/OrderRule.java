package com.iwaodev.domain.order;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;

@Component
public class OrderRule {

  @Getter
  @Value("${business.order.refund.eligible.days}") 
  private int eligibleDays;
  
}
