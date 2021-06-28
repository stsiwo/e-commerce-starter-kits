package com.iwaodev.infrastructure.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PostLoad;
import javax.persistence.Transient;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Pattern;

import com.iwaodev.domain.product.validator.ProductValidation;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.exception.OutOfStockException;
import com.iwaodev.infrastructure.model.listener.ProductValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ProductValidation()
@ToString()
@Data
@EntityListeners(ProductValidationListener.class)
@Entity(name = "products")
public class Product {

  private static final Logger logger = LoggerFactory.getLogger(Product.class);

  @NotNull(message = "{product.id.notnull}")
  @Id
  @Column(name = "product_id")
  @Type(type = "uuid-char")
  private UUID productId;

  @NotEmpty(message = "{product.productName.notempty}")
  @Column(name = "product_name")
  private String productName;

  @NotEmpty(message = "{product.productDescription.notempty}")
  @Column(name = "product_description")
  private String productDescription;

  @NotEmpty(message = "{product.productPath.notempty}")
  @Pattern(regexp = "^[a-zA-Z0-9-_]*$", message = "{product.productPath.invalidformat}")
  @Column(name = "product_path", unique = true)
  private String productPath;

  @NotNull(message = "{product.productBaseUnitPrice.notnull}")
  @DecimalMin(value = "1.0", message = "{product.productBaseUnitPrice.min1}")
  @Column(name = "product_base_unit_price")
  private BigDecimal productBaseUnitPrice = new BigDecimal(1);

  @Column(name = "product_base_discount_price")
  private BigDecimal productBaseDiscountPrice = new BigDecimal(1);

  @Column(name = "product_base_discount_start_date")
  private LocalDateTime productBaseDiscountStartDate;

  @Column(name = "product_base_discount_end_date")
  private LocalDateTime productBaseDiscountEndDate;

  @NotNull(message = "{product.isDiscount.notnull}")
  @Column(name = "is_discount")
  private Boolean isDiscount = false;

  @NotNull(message = "{product.isPublic.notnull}")
  @Column(name = "is_public")
  private Boolean isPublic = false;

  @Formula("(select avg(r.review_point) from products p inner join reviews r on r.product_id = p.product_id where p.product_id = product_id)")
  private Double averageReviewPoint = 0.0D;

  // assuming discount_price is null if isDiscount = false
  // also, you need to isDiscount false when passed the end date and make discount price = null (use can use scheduled task)
  // - use 'left' isntead of 'inner' to cover the case if a product does not have any variants.
  /**
   * the logic is too complicated, so two options:
   *  - use stored procedures. (ref: https://stackoverflow.com/questions/35631975/how-to-call-a-stored-procedure-which-returns-a-composite-type-from-formula)
   *  - use @Transient and put the logic in setter with @PostLoad.
   **/
  //@Formula("(select least(p.product_base_unit_price, ifnull(p.product_base_discount_price, 2147483647), min(ifnull(pv.variant_unit_price, 2147483647)), min(ifnull(pv.variant_discount_price, 2147483647))) from products p left join product_variants pv on pv.product_id = p.product_id where p.product_id = product_id group by p.product_id)")
  @Getter(value = AccessLevel.NONE)
  @Setter(value = AccessLevel.NONE)
  @Transient
  private BigDecimal cheapestPrice;

  // - use 'left' isntead of 'inner' to cover the case if a product does not have any variants.
  @Formula("(select greatest(p.product_base_unit_price, ifnull(p.product_base_discount_price, 0), max(ifnull(pv.variant_unit_price, 0)), max(ifnull(pv.variant_discount_price, 0))) from products p left join product_variants pv on pv.product_id = p.product_id where p.product_id = product_id group by p.product_id)")
  private BigDecimal highestPrice;

  // overall result if discount exist through its variants
  // - use 'left' isntead of 'inner' to cover the case if a product does not have any variants.
  @Formula("(select exists (select 1 from products p left join product_variants pv on pv.product_id = p.product_id where p.product_id = product_id and (pv.is_discount = 1 or p.is_discount = 1) and ((p.product_base_discount_start_date < CURRENT_TIMESTAMP and CURRENT_TIMESTAMP < p.product_base_discount_end_date) or (pv.variant_discount_start_date < CURRENT_TIMESTAMP and CURRENT_TIMESTAMP < pv.variant_discount_end_date))))")
  private Boolean isDiscountAvailable;

  @NotNull(message = "{product.category.notnull}")
  @ManyToOne
  @JoinColumn(name = "category_id", foreignKey = @ForeignKey(name = "FK_products__categories"),
      // add category_id with its value when you try to create Product object and
      // persist it.
      // so 'insertable' means that when you create a product entity and persist it,
      // do you want to include this column and its value.
      // if you don't have its correspnding category id in category table, it gives FK
      // constraint error.
      insertable = true, //allow to insert this column id (FK) when persist this entity.

      // this means if the product size object of this variant entity has different value
      // than previous one, do you want to update the product size id with the new value.
      // this does not talking about updating product size entity. only this column id.
      updatable = true) // allow to update this column id (FK) when update this entity
  private Category category;

  @NotNull(message = "{product.releaseDate.notnull}")
  @Column(name = "release_date")
  private LocalDateTime releaseDate;

  @Column(name = "note")
  private String note;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  /**
   * the value of mappedBy is variable name of the other one
   * 
   * - ex) users: a variable name which must exist in User class
   **/

  // ignore this default & generated setter since need to customize for bidirectional relationship
  @Setter(value = AccessLevel.NONE)
  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
  @Filter(name = "verifiedFilter", condition = "is_verified = :isVerified")
  private List<Review> reviews = new ArrayList<>();

  // ignore this default & auto-generated setter since need to customize for bidirectional relationship
  @Setter(value = AccessLevel.NONE)
  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
  @Filter(name = "selectedVariantFilter", condition = "variant_id IN :variantIds")
  private List<ProductVariant> variants = new ArrayList<>();

  // ignore this default & auto generated setter since need to customize for bidirectional relationship
  @Setter(value = AccessLevel.NONE)
  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ProductImage> productImages = new ArrayList<>();

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  // does not want to delete orderDetail when this is deleted.
  @OneToMany(mappedBy = "product", cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH }, orphanRemoval = false)
  private List<OrderDetail> orderDetails  = new ArrayList<>();

  // constructor
  public Product() {
    this.productId = UUID.randomUUID();
  }

  /**
   * if PostLoad on entity doesnt work for you, you need to define entity listener.
   *
   * ref: https://stackoverflow.com/questions/2802676/hibernate-postload-never-gets-invoked
   *
   * #2021/06/27 - it works.
   **/
  @PostLoad
  public void setCheapestPrice() {
    this.cheapestPrice = this.getCheapestPrice();
  }

  public BigDecimal getCheapestPrice() {

    logger.info("try to get cheapest price");
    BigDecimal cheapestPrice = this.productBaseUnitPrice;

    logger.info("cur cheapest: " + cheapestPrice);
    // if product discount, compare base unit price and discount price and get cheaper price
    if (this.isDiscount && this.getProductBaseDiscountStartDate().isBefore(LocalDateTime.now()) && this.getProductBaseDiscountEndDate().isAfter(LocalDateTime.now())) {
      cheapestPrice = cheapestPrice.min(this.productBaseDiscountPrice); 
      logger.info("cur cheapest at product discount: " + cheapestPrice);
    }

    // pick cheapest price among all variants
    for (ProductVariant variant: this.variants) {

      // if the variant has its own unit price
      if (variant.getVariantUnitPrice() != null) {
        cheapestPrice = cheapestPrice.min(variant.getVariantUnitPrice());
      }

      // if the variant is discount
      if (variant.getIsDiscount() &&  variant.getVariantDiscountStartDate().isBefore(LocalDateTime.now()) && variant.getVariantDiscountEndDate().isAfter(LocalDateTime.now())) {
        cheapestPrice = cheapestPrice.min(variant.getVariantDiscountPrice());
      }
    }

    return cheapestPrice;
  }

  public boolean isAnyVariantDiscount() {
    boolean discount = false;
    for (ProductVariant variant : this.variants) {
      if (variant.getIsDiscount() && variant.getVariantDiscountStartDate().isBefore(LocalDateTime.now()) && variant.getVariantDiscountEndDate().isAfter(LocalDateTime.now())) {
        discount = true; 
      }
    }
    return discount;
  }

  public void setReviews(List<Review> reviews) {
    this.reviews = reviews;

    for (Review review : reviews) {
      review.setProduct(this);
    }
  }

  public void setVariants(List<ProductVariant> variants) {
    this.variants = variants;

    for (ProductVariant variant : variants) {
      variant.setProduct(this);
    }
  }

  public void addVariant(ProductVariant variant) {
    this.variants.add(variant);
    variant.setProduct(this);
  }

  public void setProductImages(List<ProductImage> productImages) {
    this.productImages = productImages;

    for (ProductImage productImage : productImages) {
      productImage.setProduct(this);
    }
  }

  public void addProductImage(ProductImage productImage) {
    this.productImages.add(productImage);
    productImage.setProduct(this);
  }

  public void removeProductImage(ProductImage productImage) {
    this.productImages.remove(productImage);
    productImage.setProduct(null);
  }

  public void setOrderDetailItems(List<OrderDetail> orderDetails) {
    this.orderDetails = orderDetails;

    for (OrderDetail orderDetail : orderDetails) {
      orderDetail.setProduct(this);
    }
  }

  public void addOrderDetailItem(OrderDetail orderDetail) {
    this.orderDetails.add(orderDetail);
    orderDetail.setProduct(this);
  }

  public void removeOrderDetailItem(OrderDetail orderDetail) {
    this.orderDetails.remove(orderDetail);
    orderDetail.setProduct(null);
  }

  public boolean isVariantExist(Long variantId) {

    for (ProductVariant variant : variants) {
      if (variant.getVariantId().equals(variantId)) {
        return true;
      }
    }
    return false;

  }

  public void addSoldCountForVariant(Integer soldCount, Long variantId) {

    ProductVariant variant = this.findVariantById(variantId);
    Integer curSoldCount = variant.getSoldCount();
    Integer nextSoldCount = curSoldCount.intValue() + soldCount;
    variant.setSoldCount(nextSoldCount);
  }

  public ProductVariant findVariantById(Long variantId) {
    for (ProductVariant variant : variants) {
      if (variant.getVariantId().equals(variantId)) {
        return variant;
      }
    }
    return null;
  }

  public boolean isEnoughStock(Integer quantity, Long variantId) {
    ProductVariant variant = this.findVariantById(variantId);  
    if (variant.getVariantStock() < quantity) {
      return false;
    }
    return true;
  }

  /**
   * get current price of this variant including discount
   *
   *  - price logic
   *
   *    - if variant discount price available, return this
   *    - else if product discount price available, return this
   *    - else if variant unit price is set, return this
   *    - else return product base unit price.
   * 
   **/
  public BigDecimal getCurrentPriceOfVariant(Long variantId) throws NotFoundException {

    ProductVariant variant = this.findVariantById(variantId);

    if (variant == null) {
      throw new NotFoundException("the target variant does not exist. (variant id: " + variantId + ")");
    }

    return variant.getCurrentPrice();
  }

  public String getColorOfVariant(Long variantId) throws NotFoundException {

    ProductVariant variant = this.findVariantById(variantId);

    if (variant == null) {
      throw new NotFoundException("the target variant does not exist. (variant id: " + variantId + ")");
    }

    return variant.getVariantColor();
  }

  public String getSizeOfVariant(Long variantId) throws NotFoundException {

    ProductVariant variant = this.findVariantById(variantId);

    if (variant == null) {
      throw new NotFoundException("the target variant does not exist. (variant id: " + variantId + ")");
    }

    return variant.getProductSize().getProductSizeName();
  }

  public void decreaseStockOfVariant(Integer amount, Long variantId) throws NotFoundException, OutOfStockException {

    ProductVariant variant = this.variants.stream().filter(var -> var.getVariantId().equals(variantId)).findFirst().orElse(null);

    if (variant == null) {
      throw new NotFoundException("the target variant does not exist. (variant id: " + variantId + ")");
    }

    Integer stock = variant.getVariantStock();
    Integer nextStock = stock - amount;

    if (nextStock < 0) {
      throw new OutOfStockException("the target variant does not have enough stock. (variant id: " + variantId + ")");
    }

    variant.setVariantStock(nextStock);
  }

  public void increaseStockOfVariantBack(Integer amount, Long variantId) throws NotFoundException {
    ProductVariant variant = this.variants.stream().filter(var -> var.getVariantId().equals(variantId)).findFirst().orElse(null);
    if (variant == null) {
      throw new NotFoundException("the target variant does not exist. (variant id: " + variantId + ")");
    }
    Integer stock = variant.getVariantStock();
    Integer nextStock = stock + amount;
    variant.setVariantStock(nextStock);
  }

  /**
   * update an existing variant.
   *
   **/
  public void updateVariant(Long variantId, ProductVariant nextVariant) {
    ProductVariant variant = this.findVariantById(variantId);
    this.removeVariant(variant);
    this.addVariant(nextVariant);
  }

  public void removeVariant(ProductVariant variant) {
    this.variants.remove(variant);
    variant.setProduct(null);
  }

  public void removeVariantById(Long variantId) {
    ProductVariant variant = this.findVariantById(variantId);
    this.removeVariant(variant);
  }

  // find variant by color and size
  public Optional<ProductVariant> findVariantByColorAndSize(String color, Long sizeId) {
    return this.variants.stream().filter(variant -> {
      if (variant.getVariantColor().equals(color) && variant.getProductSize().getProductSizeId().equals(sizeId)) {
        return true;
      } else {
        return false;
      }
    }).findFirst();
  }
}
