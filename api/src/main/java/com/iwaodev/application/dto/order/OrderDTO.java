package com.iwaodev.application.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.iwaodev.domain.order.OrderStatusEnum;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@ToString
public class OrderDTO {

  private UUID orderId;

  private String orderNumber;

  private BigDecimal productCost;

  private BigDecimal taxCost;

  private BigDecimal shippingCost;

  private String note;

  private String orderFirstName;

  private String orderLastName;

  private String orderEmail;

  private String orderPhone;

  private OrderAddressDTO shippingAddress;

  private OrderAddressDTO billingAddress;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  private OrderUserDTO user;

  private List<OrderEventDTO> orderEvents;

  private List<OrderDetailDTO> orderDetails;

  private List<OrderStatusEnum> nextAdminOrderEventOptions;

  private List<OrderStatusEnum> nextMemberOrderEventOptions;

  private OrderEventDTO latestOrderEvent;

  private String currency;

}


