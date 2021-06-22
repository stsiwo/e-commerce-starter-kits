package com.iwaodev.application.irepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.persistence.LockModeType;
import javax.persistence.QueryHint;

import com.iwaodev.infrastructure.model.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * - nativeQuery: use row SQL statement. (not JPQL)
 *
 * - don't return different entity rather than the main entity (e.g., Product)
 **/

@Repository
public interface ProductRepository
    extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product>, AdvanceProductRepository {

  /**
   * to avoid n+1 problem, use EntityGraph.
   *
   * this does not work since MultipleBagsException for more than one association fetching together.
   *
   **/
  //@EntityGraph(type = EntityGraphType.FETCH, attributePaths = { "reviews", "variants", "productImages" })
  //Page<Product> findAll(Specification<Product> spec, Pageable pageable);

  @Query(value = "SELECT p FROM products p INNER JOIN p.variants v WHERE v.variantId = ?1")
  Optional<Product> findByVariantId(Long variantId);

  /**
   * find by productPath
   **/
  @Query(value = "SELECT p FROM products p WHERE p.productPath = ?1")
  Optional<Product> findByPath(String path);

  /**
   * find by productPath or id
   **/
  @Query(value = "SELECT p FROM products p WHERE p.productPath = ?1 OR p.productId = ?1")
  Optional<Product> findByPathOrId(String path);

  /**
   * find by productPath or id (public)
   **/
  @Query(value = "SELECT p FROM products p WHERE (p.productPath = ?1 OR p.productId = ?1) AND p.isPublic = 1")
  Optional<Product> findPublicByPathOrId(String path);

  /**
   * do I have to define lock scope (for related entity e.g., productvariant)? -
   * https://www.baeldung.com/jpa-pessimistic-locking
   **/
  @Lock(LockModeType.PESSIMISTIC_READ)
  @QueryHints({ @QueryHint(name = "javax.persistence.lock.timeout", value = "3000") })
  @Query(value = "SELECT p FROM products p WHERE p.productId = ?1")
  Optional<Product> findByIdWithPessimisticLock(UUID productId);

  @Query(value = "SELECT p FROM products p INNER JOIN p.variants v WHERE v.variantId IN :variantIds")
  List<Product> findAllByVariantIds(@Param("variantIds") List<Long> variantIds);

  @Query(value = "SELECT p FROM products p WHERE DATE(p.release_date) = CURDATE()", nativeQuery = true)
  List<Product> findAllNewProducts();
}
