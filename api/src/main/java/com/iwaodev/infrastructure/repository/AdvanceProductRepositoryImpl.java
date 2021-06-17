package com.iwaodev.infrastructure.repository;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iwaodev.application.irepository.AdvanceProductRepository;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductVariant;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;


/**
 * any custom repository implementation must be registered with its target repository implementation name.
 *
 *
 * see note.md#CustomizedRepositoryImplementation more detail.
 *
 **/
@Component("productRepositoryImpl") // must be target repository implementation name
public class AdvanceProductRepositoryImpl implements AdvanceProductRepository {

  @PersistenceContext
  private EntityManager entityManager;

	@Override
	public Map<UUID, Product> findAllByIds(List<UUID> productIds) {

    return this.entityManager.createQuery("SELECT p FROM products p WHERE p.productId IN :ids", Product.class)
      .setParameter("ids", productIds)
      .getResultStream()
      .collect(Collectors.toMap(
            product -> ((UUID) product.getProductId()),
            product -> ((Product) product)
          ));
	}

	@Override
	public Optional<ProductVariant> findVariantByColorAndSize(UUID productId, String color, String size) {
    return this.entityManager.createQuery("SELECT pv FROM products p INNER JOIN productVariants pv INNER JOIN productSizes ps WHERE p.productId = :productId AND pv.variantColor = :color AND ps.productSizeName = :size", ProductVariant.class)
      .setParameter("productId", productId)
      .setParameter("color", color)
      .setParameter("size", size)
      .getResultList()
      .stream()
      .findFirst();
	}
}
