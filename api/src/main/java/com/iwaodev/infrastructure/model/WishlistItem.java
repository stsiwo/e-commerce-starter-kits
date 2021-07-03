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
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.infrastructure.model.listener.WishlistItemValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * need this to prevent circular dependencies.
 *
 * - it causes 'java.lang.StackOverflowError'
 **/
@Data
@ToString
@NoArgsConstructor
@EntityListeners(WishlistItemValidationListener.class)
@Entity(name = "wishlistItems")
@Table(name = "wishlist_items", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "variant_id" }))
public class WishlistItem implements Serializable {

  private static final long serialVersionUID = 1L;

  @Null(message = "{wishlistItem.id.null}", groups = OnCreate.class)
  @NotNull(message = "{wishlistItem.id.notnull}", groups = OnUpdate.class)
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "wishlist_item_id")
  private Long wishlistItemId;

  @NotNull(message = "{wishlistItem.user.notnull}")
  @ManyToOne
  @JoinColumn(name = "user_id", insertable = true, updatable = true)
  private User user;

  @NotNull(message = "{wishlistItem.variant.notnull}")
  @ManyToOne
  @JoinColumn(name = "variant_id", insertable = true, updatable = true)
  private ProductVariant variant;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

}
