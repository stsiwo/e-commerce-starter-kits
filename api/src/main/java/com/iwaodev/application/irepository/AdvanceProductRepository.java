package com.iwaodev.application.irepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductVariant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface AdvanceProductRepository {

  public Map<UUID, Product> findAllByIds(List<UUID> productIds);

  public Optional<ProductVariant> findVariantByColorAndSize(UUID productId, String color, String size);

  public Page<Product> findAllToAvoidNPlusOne(Specification<Product> spec, Pageable pageable);

  /**
   * check if email exists ecept for this userId
   **/
  public Boolean isOthersHavePath(UUID productId, String productPath);

  /**
   * check if email exists ecept for this userId
   **/
  public Boolean isOthersHaveColorAndSize(UUID productId, Long variantId, String color, String size);

}
