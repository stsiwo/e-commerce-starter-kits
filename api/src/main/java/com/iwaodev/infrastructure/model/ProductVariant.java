package com.iwaodev.infrastructure.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.domain.product.validator.ProductVariantValidation;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;
import com.iwaodev.ui.validator.optional.digit.OptionalDigit;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ProductVariantValidation()
@Data
@ToString
@NoArgsConstructor
//@EntityListeners(ProductVariantValidationListener.class)
@Entity(name = "product_variants")
@FilterDef(
    name = "selectedVariantFilter",
    parameters = @ParamDef(name = "variantIds", type = "long[]")
)
@Filter(
    name = "selectedVariantFilter",
    condition = "variant_id IN :variantIds"
)
public class ProductVariant {

  @Null(message = "{productVariant.id.null}", groups = OnCreate.class)
  @NotNull(message = "{productVariant.id.notnull}", groups = OnUpdate.class)
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "variant_id")
  private Long variantId;

  // optional 
  @OptionalDigit(integer = 6, fraction = 2, message = "{productVariant.variantUnitPrice.invalidformat}")
  @Column(name = "variant_unit_price")
  private BigDecimal variantUnitPrice = new BigDecimal("1");

  @OptionalDigit(integer = 6, fraction = 2, message = "{productVariant.variantDiscountPrice.invalidformat}")
  @Column(name = "variant_discount_price")
  private BigDecimal variantDiscountPrice = new BigDecimal("1");

  @Column(name = "variant_discount_start_date")
  private LocalDateTime variantDiscountStartDate;

  @Column(name = "variant_discount_end_date")
  private LocalDateTime variantDiscountEndDate;

  @NotNull(message = "{productVariant.variantStock.notnull}")
  @Min(value = 0, message = "{productVariant.variantStock.min0}")
  @Column(name = "variant_stock")
  private Integer variantStock = 0;

  @NotNull(message = "{productVariant.isDiscount.notnull}")
  @Column(name = "is_discount")
  private Boolean isDiscount = false;

  @NotNull(message = "{productVariant.soldCount.notnull}")
  @Column(name = "sold_count")
  private Integer soldCount = 0;

  @Column(name = "note")
  private String note;

  @NotEmpty(message = "{productVariant.variantColor.notempty}")
  @Column(name = "variant_color")
  private String variantColor;

  @NotNull(message = "{productVariant.variantWeight.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantWeight.invalidformat}")
  @Column(name = "variant_weight")
  private Double variantWeight = 0.5; // kg

  @NotNull(message = "{productVariant.variantHeight.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantHeight.invalidformat}")
  @Column(name = "variant_height")
  private Double variantHeight = 5.0; // cm

  @NotNull(message = "{productVariant.variantLength.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantLength.invalidformat}")
  @Column(name = "variant_length")
  private Double variantLength = 5.0; // cm

  @NotNull(message = "{productVariant.variantWidth.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{productVariant.variantWidth.invalidformat}")
  @Column(name = "variant_width")
  private Double variantWidth = 5.0; // cm

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @NotNull(message = "{productVariant.product.notnull}")
  @ManyToOne
  @JoinColumn(name = "product_id", foreignKey = @ForeignKey(name = "FK_product_variants__products"), insertable = true, updatable = true) // insert & update when parent try to update this child entity
  private Product product;

  @NotNull(message = "{productVariant.productSize.notnull}")
  @ManyToOne
  @JoinColumn(name = "product_size_id", foreignKey = @ForeignKey(name = "FK_product_variants__product_sizes"), insertable = false, updatable = false) // NOT insert & update when parent try to update this child entity
  private ProductSize productSize;

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CartItem> cartItems = new ArrayList<>();

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<WishlistItem> wishlistItems = new ArrayList<>();

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  // does not want to delete orderDetail when this is deleted.
  @OneToMany(mappedBy = "productVariant", cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH }, orphanRemoval = false)
  private List<OrderDetail> orderDetails  = new ArrayList<>();

  public void setCartItems(List<CartItem> cartItems) {
    this.cartItems = cartItems;

    for (CartItem cartItem : cartItems) {
      cartItem.setVariant(this);
    }
  }

  public void addCartItem(CartItem cartItem) {
    this.cartItems.add(cartItem);
    cartItem.setVariant(this);
  }

  public void removeCartItem(CartItem cartItem) {
    this.cartItems.remove(cartItem);
    cartItem.setVariant(null);
  }

  public void setWishlistItems(List<WishlistItem> wishlistItems) {
    this.wishlistItems = wishlistItems;

    for (WishlistItem wishlistItem : wishlistItems) {
      wishlistItem.setVariant(this);
    }
  }

  public void addWishlistItem(WishlistItem wishlistItem) {
    this.wishlistItems.add(wishlistItem);
    wishlistItem.setVariant(this);
  }

  public void removeWishlistItem(WishlistItem wishlistItem) {
    this.wishlistItems.remove(wishlistItem);
    wishlistItem.setVariant(null);
  }

  public void setOrderDetailItems(List<OrderDetail> orderDetails) {
    this.orderDetails = orderDetails;

    for (OrderDetail orderDetail : orderDetails) {
      orderDetail.setProductVariant(this);
    }
  }

  public void addOrderDetailItem(OrderDetail orderDetail) {
    this.orderDetails.add(orderDetail);
    orderDetail.setProductVariant(this);
  }

  public void removeOrderDetailItem(OrderDetail orderDetail) {
    this.orderDetails.remove(orderDetail);
    orderDetail.setProductVariant(null);
  }

  // business behaviors
}
