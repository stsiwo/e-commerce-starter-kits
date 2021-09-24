package com.iwaodev.infrastructure.model;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

import com.iwaodev.infrastructure.model.listener.ProductImageValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.sql.Timestamp;

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

  @Version
  @Column(name = "version")
  private Long version = 0L;

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
