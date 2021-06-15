package com.iwaodev.infrastructure.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

import com.iwaodev.infrastructure.model.listener.OrderDetailValidationListener;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.JoinColumnOrFormula;
import org.hibernate.annotations.JoinColumnsOrFormulas;
import org.hibernate.annotations.JoinFormula;
import org.hibernate.annotations.UpdateTimestamp;

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

  @Id
  @Column(name = "order_detail_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long orderDetailId;

  @Column(name = "product_quantity")
  private Integer productQuantity;

  @Column(name = "product_unit_price")
  private BigDecimal productUnitPrice;

  @Column(name = "product_color")
  private String productColor;

  @Column(name = "product_size")
  private String productSize;

  @Column(name = "product_name")
  private String productName;

  // don't make directory setter function at this side (ManyToOne). define the bidirectional setter at (OneToMany) only
  @ManyToOne
  @JoinColumn(name = "order_id")
  private Order order;

  //@ManyToMany
  //@JoinTable(name = "order_details__products", joinColumns = {
  //    @JoinColumn(name = "order_detail_id") }, inverseJoinColumns = { @JoinColumn(name = "products_id") })
  //private List<Product> products = new ArrayList<>();

  @ManyToOne
  @JoinColumn(name = "product_variant_id")
  private ProductVariant productVariant;

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
