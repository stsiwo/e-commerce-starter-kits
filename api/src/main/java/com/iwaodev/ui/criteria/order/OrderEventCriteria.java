package com.iwaodev.ui.criteria.order;

import java.util.UUID;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

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
   * only member/admin can use this order history system for this criteria.
   **/
  @NotNull(message = "{orderEvent.user.notnull}")
  private UUID userId;

  // optional
  @Size(max = 1000, message = "{orderEvent.note.max1000}")
  private String note;

}



