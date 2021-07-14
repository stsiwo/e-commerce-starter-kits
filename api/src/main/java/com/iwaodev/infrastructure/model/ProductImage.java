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
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.infrastructure.model.listener.ProductImageValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@EntityListeners(ProductImageValidationListener.class)
@Entity(name = "productImages")
public class ProductImage {

  @Null(message = "{productImage.id.null}", groups = OnCreate.class)
  @NotNull(message = "{productImage.id.notnull}", groups = OnUpdate.class)
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "product_image_id")
  private Long productImageId;

  @Column(name = "product_image_path")
  private String productImagePath;

  @NotNull(message = "{productImage.isChange.notnull}")
  @Column(name = "is_change")
  private Boolean isChange;

  @NotEmpty(message = "{productImage.productImageName.notempty}")
  @Column(name = "product_image_name")
  private String productImageName;

  @NotNull(message = "{productImage.product.notnull}")
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
