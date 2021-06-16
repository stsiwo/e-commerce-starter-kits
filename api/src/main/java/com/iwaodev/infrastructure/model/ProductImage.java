package com.iwaodev.infrastructure.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.iwaodev.infrastructure.model.listener.ProductImageValidationListener;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@EntityListeners(ProductImageValidationListener.class)
@Entity(name = "product_images")
public class ProductImage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "product_image_id")
  private Long productImageId;

  @Column(name = "product_image_path")
  private String productImagePath;

  @Column(name = "is_change")
  private Boolean isChange;

  @Column(name = "product_image_name")
  private String productImageName;

  @ManyToOne
  @JoinColumn(
    name = "product_id", 
    foreignKey = @ForeignKey(name = "FK_product_images__products"),
    insertable = true,
    updatable = false
    )
  private Product product;

  public ProductImage(String productImagePath) {
    this.productImagePath = productImagePath;
  }
}
