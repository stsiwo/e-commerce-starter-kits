package com.iwaodev.ui.criteria.wishlistItem;

import java.util.UUID;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.domain.wishlistItem.validator.UserAndVariantMustBeUnique;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@UserAndVariantMustBeUnique()
@ToString
@Data
@NoArgsConstructor
@Validated
public class WishlistItemCriteria {

  @Null(message = "{wishlistItem.id.null}", groups = OnCreate.class)
  @NotNull(message = "{wishlistItem.id.notnull}", groups = OnUpdate.class)
  private Long wishlistItemId;

  @NotNull(message = "{wishlistItem.user.notnull}")
  private UUID userId; 
  
  @NotNull(message = "{wishlistItem.variant.notnull}")
  private Long variantId;

}


