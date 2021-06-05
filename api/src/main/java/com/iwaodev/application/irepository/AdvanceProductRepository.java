package com.iwaodev.application.irepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.iwaodev.infrastructure.model.Product;

public interface AdvanceProductRepository {

  public Map<UUID, Product> findAllByIds(List<UUID> productIds);
}
