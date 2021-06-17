package com.iwaodev.infrastructure.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

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

  @OneToMany(mappedBy = "productSize", cascade = CascadeType.ALL, orphanRemoval = false)
  private List<ProductVariant> productVariants = new ArrayList<>();
}
