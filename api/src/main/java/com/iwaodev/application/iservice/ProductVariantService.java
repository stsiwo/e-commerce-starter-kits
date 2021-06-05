package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.productVariant.ProductVariantDTO;
import com.iwaodev.ui.criteria.ProductVariantCriteria;

public interface ProductVariantService {

  public List<ProductVariantDTO> getAll(UUID productId);

  public ProductVariantDTO create(UUID productId, ProductVariantCriteria criteria);

  public ProductVariantDTO replace(UUID productId, Long variantId, ProductVariantCriteria criteria);

  public void delete(UUID productId, Long variantId);
}



