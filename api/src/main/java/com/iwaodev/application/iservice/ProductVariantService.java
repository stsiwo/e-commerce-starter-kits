package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.productVariant.ProductVariantDTO;
import com.iwaodev.ui.criteria.product.ProductVariantCriteria;

public interface ProductVariantService {

  public List<ProductVariantDTO> getAll(UUID productId) throws Exception;

  public ProductVariantDTO create(UUID productId, ProductVariantCriteria criteria) throws Exception;

  public ProductVariantDTO replace(UUID productId, Long variantId, ProductVariantCriteria criteria) throws Exception;

  public void delete(UUID productId, Long variantId) throws Exception;
}



