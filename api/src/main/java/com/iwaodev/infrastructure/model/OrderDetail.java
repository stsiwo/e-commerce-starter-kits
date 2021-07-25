package com.iwaodev.infrastructure.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.*;

import com.iwaodev.infrastructure.model.listener.OrderDetailValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity(name = "orderDetails")
@Data
@NoArgsConstructor
@EntityListeners(OrderDetailValidationListener.class)
@ToString
public class OrderDetail {

  private static final Logger logger = LoggerFactory.getLogger(OrderDetail.class);

  @Null(message = "{orderDetail.id.null}", groups = OnCreate.class)
  @NotNull(message = "{orderDetail.id.notnull}", groups = OnUpdate.class)
  @Id
  @Column(name = "order_detail_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long orderDetailId;

  @NotNull(message = "{orderDetail.productQuantity.notnull}")
  @Min(value = 1, message = "{orderDetail.productQuantity.min1}")
  @Max(value = 10, message = "{orderDetail.productQuantity.max10}")
  @Column(name = "product_quantity")
  private Integer productQuantity;

  @NotNull(message = "{orderDetail.productUnitPrice.notnull}")
  @DecimalMin(value = "1.0", message = "{orderDetail.productUnitPrice.min1}")
  @Column(name = "product_unit_price")
  private BigDecimal productUnitPrice;

  @NotEmpty(message = "{orderDetail.productColor.notempty}")
  @Column(name = "product_color")
  private String productColor;

  @NotEmpty(message = "{orderDetail.productSize.notempty}")
  @Column(name = "product_size")
  private String productSize;

  @NotEmpty(message = "{orderDetail.productName.notempty}")
  @Size(max = 500, message = "{product.productName.max500}")
  @Column(name = "product_name")
  private String productName;

  @NotNull(message = "{orderDetail.productWeight.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{orderDetail.productWeight.invalidformat}")
  @DecimalMin(value = "0.01", message = "{orderDetail.productWeight.min001}", inclusive = true)
  @Setter(value = AccessLevel.NONE)
  @Column(name = "product_weight")
  private Double productWeight = 0.01;

  // don't make directory setter function at this side (ManyToOne). define the bidirectional setter at (OneToMany) only
  @NotNull(message = "{orderDetail.order.notnull}")
  @ManyToOne
  @JoinColumn(name = "order_id")
  private Order order;

  //@ManyToMany
  //@JoinTable(name = "order_details__products", joinColumns = {
  //    @JoinColumn(name = "order_detail_id") }, inverseJoinColumns = { @JoinColumn(name = "products_id") })
  //private List<Product> products = new ArrayList<>();

  @NotNull(message = "{orderDetail.productVariant.notnull}", groups = OnCreate.class)
  @ManyToOne
  @JoinColumn(name = "product_variant_id")
  private ProductVariant productVariant;

  @NotNull(message = "{orderDetail.product.notnull}", groups = OnCreate.class)
  @ManyToOne
  @JoinColumn(name = "product_id")
  private Product product;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  // use SQL (not HQL/JPQL) everything is sql even if ref id
  @Formula("(select case when (count(*) > 0) then true else false end from orders o inner join order_details od on od.order_id = o.order_id inner join order_events oe on oe.order_id = o.order_id where oe.order_status = 'DELIVERED' and od.product_id is not null and od.order_detail_id = order_detail_id)")
  private Boolean isReviewable;


  public OrderDetail(Integer productQuantity, BigDecimal productUnitPrice, String productColor, String productSize, String productName, ProductVariant productVariant, Product product, Order order) {
    this.productQuantity = productQuantity;
    this.productUnitPrice = productUnitPrice;
    this.productColor = productColor;
    this.productSize = productSize;
    this.productName = productName;
    this.productVariant = productVariant;
    this.product = product;
    this.order = order;
  }

  // business behaviors
  
  public Product getProduct() {
    if (this.productVariant != null) {
      return this.productVariant.getProduct();
    }
    return null;
  }

  /**
   * set product weight = variant_weight * product_quantity
   **/
  public void setProductWeight(Double unitWeight, Integer quantity) {
    BigDecimal totalWeight = new BigDecimal(unitWeight);
    Double result = totalWeight.multiply(new BigDecimal(quantity)).setScale(3, RoundingMode.HALF_UP).doubleValue();
    this.productWeight = result;
  }


}
