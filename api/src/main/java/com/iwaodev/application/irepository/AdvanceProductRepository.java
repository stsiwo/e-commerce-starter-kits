package com.iwaodev.application.irepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductVariant;

public interface AdvanceProductRepository {

  public Map<UUID, Product> findAllByIds(List<UUID> productIds);

  public Optional<ProductVariant> findVariantByColorAndSize(UUID productId, String color, String size);
}
