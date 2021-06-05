package com.iwaodev.ui.response;

import com.iwaodev.application.dto.order.OrderDTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class PaymentIntentResponse {

  private String clientSecret;

  private OrderDTO order;

  public PaymentIntentResponse(String clientSecret, OrderDTO order) {
    this.clientSecret = clientSecret;
    this.order = order;
  }
}
