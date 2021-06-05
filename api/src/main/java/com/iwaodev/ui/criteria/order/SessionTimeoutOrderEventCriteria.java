package com.iwaodev.ui.criteria.order;

import javax.validation.constraints.NotEmpty;

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
public class SessionTimeoutOrderEventCriteria {
  
  /**
   * only member/admin can use this order history system.
   **/
  @NotEmpty(message = "order number can not be null.")
  private String orderNumber;
}




