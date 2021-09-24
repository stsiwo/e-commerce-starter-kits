package com.iwaodev.application.dto.order;

import java.time.LocalDateTime;

import com.iwaodev.domain.order.OrderStatusEnum;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@ToString
public class OrderEventDTO {

  private Long orderEventId;

  private Boolean undoable;

  private String note;

  private OrderStatusEnum OrderStatus;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  private OrderUserDTO user;

  private Long version;
}



