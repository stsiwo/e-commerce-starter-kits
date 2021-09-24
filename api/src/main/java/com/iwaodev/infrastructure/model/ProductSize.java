package com.iwaodev.infrastructure.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@Entity(name = "productSizes")
public class ProductSize {

  @Id
  @Column(name = "product_size_id")
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long productSizeId;

  @Column(name = "product_size_name")
  private String productSizeName;

  @Column(name = "product_size_description")
  private String productSizeDescription;

  @Version
  @Column(name = "version")
  private Long version = 0L;

  // any change of this entity should not affect to its children
  @OneToMany(mappedBy = "productSize", cascade = {}, orphanRemoval = false)
  private List<ProductVariant> productVariants = new ArrayList<>();
}
