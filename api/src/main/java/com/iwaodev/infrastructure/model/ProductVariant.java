package com.iwaodev.infrastructure.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import javax.persistence.Transient;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.domain.product.validator.ProductVariantValidation;
import com.iwaodev.infrastructure.model.listener.ProductVariantListener;
import com.iwaodev.infrastructure.model.listener.ProductVariantValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;
import com.iwaodev.ui.validator.optional.digit.OptionalDigit;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.UpdateTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// DOUBT thsi might need to be removed
@ProductVariantValidation()
@Data
@ToString
@NoArgsConstructor
@EntityListeners(value = { ProductVariantValidationListener.class, ProductVariantListener.class })
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

  private static final Logger logger = LoggerFactory.getLogger(ProductVariant.class);

  @Null(message = "{productVariant.id.null}", groups = OnCreate.class)
  @NotNull(message = "{productVariant.id.notnull}", groups = OnUpdate.class)
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "variant_id")
  private Long variantId;

  // optional 
  @OptionalDigit(integer = 6, fraction = 2, message = "{productVariant.variantUnitPrice.invalidformat}")
  @Column(name = "variant_unit_price")
  private BigDecimal variantUnitPrice;

  @OptionalDigit(integer = 6, fraction = 2, message = "{productVariant.variantDiscountPrice.invalidformat}")
  @Column(name = "variant_discount_price")
  private BigDecimal variantDiscountPrice;

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
  @JoinColumn(
    name = "product_size_id", 
    foreignKey = @ForeignKey(name = "FK_product_variants__product_sizes"), 
      // add product size id with its value when you try to create variant object and
      // persist it.
      // so 'insertable' means that when you create a product entity and persist it,
      // do you want to include this column and its value.
      // if you don't have its correspnding category id in category table, it gives FK
      // constraint error.
    insertable = true,  //allow to insert this column id (FK) when persist this parent entity.
      // this means if the product size object of this variant entity has different value
      // than previous one, do you want to update the product size id with the new value.
      // this does not talking about updating product size entity. only this column id.
    updatable = true // allow to update this column id (FK) when update this parent entity
    ) 
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

  /**
   * whether this variant is disount or not.
   *
   **/
  @Formula("(select exists (select 1 from products p inner join product_variants pv on pv.product_id = p.product_id where pv.variant_id = variant_id and (pv.is_discount = 1) and (pv.variant_discount_start_date < CURRENT_TIMESTAMP() and CURRENT_TIMESTAMP() < pv.variant_discount_end_date)))")
  private Boolean isDiscountAvailable;

  /**
   * get either product variant unit price or product base unit price based on the variant unit price is defined or not.
   *
   * used to show the regular price when it is discount and show the difference of the discount price.
   *
   * COALESCE: return the first non-null column
   *
   **/
  @Formula("(select COALESCE(pv.variant_unit_price, p.product_base_unit_price) from products p inner join product_variants pv on pv.product_id = p.product_id where pv.variant_id = variant_id)")
  private BigDecimal regularPrice;

  @Getter(value = AccessLevel.NONE)
  @Setter(value = AccessLevel.NONE)
  @Transient
  private BigDecimal currentPrice;

  /**
   * if PostLoad on entity doesnt work for you, you need to define entity listener.
   *
   * ref: https://stackoverflow.com/questions/2802676/hibernate-postload-never-gets-invoked
   **/
  @PostLoad
  public void setCurrentPrice() {
    this.currentPrice = this.getCurrentPrice();
  }

  /**
   * don't do this. this deos not update the parent entity (e.g., product) and produce nullpointerexcepiton.
   *
   **/
  //@PrePersist
  //@PreUpdate
  //@PreRemove
  //public void setUp() {
  //  if (this.product != null) {
  //    logger.info("start setup");
  //    this.product.setCheapestPrice();
  //    this.product.setHighestPrice();
  //    logger.info("end setup");
  //  }
  //}

  public BigDecimal getCurrentPrice() {

    if (this.getIsDiscount() && this.variantDiscountStartDate.isBefore(LocalDateTime.now()) && this.variantDiscountEndDate.isAfter(LocalDateTime.now())) {
      return this.getVariantDiscountPrice();
    } 

    if (this.getVariantUnitPrice() != null) {
      return this.getVariantUnitPrice();
    } 

    return this.product.getProductBaseUnitPrice();
  }

  public boolean isHasOwnPrice() {
    return this.variantUnitPrice != null;
  }

  public boolean isVariantDiscountPriceLessThanUnitPrice() {
    if (this.isDiscount != null && this.isDiscount) {
      if (this.isHasOwnPrice()) {
        logger.info("variant does have its price");
        return this.variantDiscountPrice.compareTo(this.variantUnitPrice) < 0;
      } else {
        logger.info("variant does not have its price");
        return this.variantDiscountPrice.compareTo(this.product.getProductBaseUnitPrice()) < 0;
      }
    }
    return true;
  }

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

}
