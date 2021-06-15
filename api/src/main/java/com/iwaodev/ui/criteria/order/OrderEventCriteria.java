package com.iwaodev.ui.criteria.order;

import java.util.UUID;

import javax.validation.constraints.NotNull;

import com.iwaodev.domain.order.OrderStatusEnum;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * use @NotEmpty for String type
 * use @NotNull for any other type rather than String
 * use @Valid for nested Criteria class
 **/

@ToString
@Data
@NoArgsConstructor
@Validated
public class OrderEventCriteria {
  
  /**
   * if update, this is mandatory
   * if new, this is ignored
   **/
  private Long orderEventId;

  /**
   * if update, this is optional 
   * if new, this is mandatory
   **/
  private OrderStatusEnum orderStatus;

  /**
   * only member/admin can use this order history system.
   **/
  @NotNull(message = "user id can not be null.")
  private UUID userId;

  // optional
  private String note;

}



