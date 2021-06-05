package com.iwaodev.ui.criteria;

import java.util.UUID;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
public class ExistingCartItemCriteiria {

  @NotNull(message = "cartItem item id name must not be null.")
  private Long cartItemId;

  //private UUID userId; 
  //
  //@NotNull(message = "variant id name must not be null.")
  //private Long variantId;

}



