package com.iwaodev.infrastructure.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.domain.cartItem.validator.CartItemValidation;
import com.iwaodev.infrastructure.model.listener.CartItemValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@CartItemValidation()
@Data
@ToString
@NoArgsConstructor
@EntityListeners(CartItemValidationListener.class)
@Entity(name = "cartItems")
@Table(name = "cart_items", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "variant_id" }))
public class CartItem implements Serializable {

  private static final long serialVersionUID = 1L;

  @Null(message = "{cartItem.id.null}", groups = OnCreate.class)
  @NotNull(message = "{cartItem.id.notnull}", groups = OnUpdate.class)
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "cart_item_id")
  private Long cartItemId;

  /**
   * you don't need to add 'custom setter' for this to make bidirectional because it causes circular function call each other.
   *
   * e.g.,) 
   * setUser(User user) {
   *  this.user = user;
   *  user.addCartItem(this) <- this call 'setUser' internally and goes on forever
   * }
   *
   **/
  @NotNull(message = "{cartItem.user.notnull}")
  @ManyToOne
  @JoinColumn(
    name = "user_id", 
    insertable = true, // Whether the column is included in SQL INSERT statements generated by the persistence provider. => if you make this false, 'user_id' column and its value are not inserted when insert a cart item.
    updatable = false // // Whether the column is included in SQL UPDATE statements generated by the persistence provider. => if you make this false, 'user_id' column and its value are not updated when update a cart item.
    )
  private User user;

  @NotNull(message = "{cartItem.variant.notnull}")
  @ManyToOne
  // variant should not be modified when the variant_id on this table is updated.
  @JoinColumn(name = "variant_id", insertable = true, updatable = false)
  private ProductVariant variant;

  @NotNull(message = "{cartItem.isSelected.notnull}")
  @Column(name = "is_selected")
  private Boolean isSelected = false;

  @NotNull(message = "{cartItem.quantity.notnull}")
  @Min(value = 1, message = "{cartItem.quantity.min1}")
  @Max(value = 10, message = "{cartItem.quantity.max10}")
  @Column(name = "quantity")
  private Integer quantity;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

}
