package com.iwaodev.infrastructure.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity(name = "orderDetails")
@Data
@NoArgsConstructor
//@EntityListeners(OrderDetailValidationListener.class)
@ToString
public class OrderDetail {

  @Null(message = "{orderDetail.id.null}", groups = OnCreate.class)
  @NotNull(message = "{orderDetail.id.notnull}", groups = OnUpdate.class)
  @Id
  @Column(name = "order_detail_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long orderDetailId;

  @NotNull(message = "{orderDetail.productQuantity.notnull}")
  @Min(value = 1, message = "{orderDetail.productQuantity.min1}")
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
  @Column(name = "product_name")
  private String productName;

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
    return this.productVariant.getProduct();
  }

}
