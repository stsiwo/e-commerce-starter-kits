package com.iwaodev.infrastructure.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;

import com.iwaodev.application.irepository.AdvanceProductRepository;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductSize;
import com.iwaodev.infrastructure.model.ProductVariant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.stereotype.Component;

/**
 * any custom repository implementation must be registered with its target
 * repository implementation name.
 *
 *
 * see note.md#CustomizedRepositoryImplementation more detail.
 *
 **/
@Component("productRepositoryImpl") // must be target repository implementation name
public class AdvanceProductRepositoryImpl implements AdvanceProductRepository {

  private static final Logger logger = LoggerFactory.getLogger(AdvanceProductRepository.class);

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public Map<UUID, Product> findAllByIds(List<UUID> productIds) {

    return this.entityManager.createQuery("SELECT p FROM products p WHERE p.productId IN :ids", Product.class)
        .setParameter("ids", productIds).getResultStream()
        .collect(Collectors.toMap(product -> ((UUID) product.getProductId()), product -> ((Product) product)));
  }

  @Override
  public Optional<ProductVariant> findVariantByColorAndSize(UUID productId, String color, String size) {
    return this.entityManager.createQuery(
        "SELECT pv FROM products p INNER JOIN p.variants pv INNER JOIN pv.productSize ps WHERE p.productId = :productId AND pv.variantColor = :color AND ps.productSizeName = :size",
        ProductVariant.class).setParameter("productId", productId).setParameter("color", color)
        .setParameter("size", size).getResultList().stream().findFirst();
  }

  @Override
  public Boolean isOthersHavePath(UUID productId, String productPath) {
    return this.entityManager.createQuery(
        "select case when (count(u) > 0)  then true else false end from products u where u.productPath = :productPath and u.productId != :productId",
        Boolean.class).setParameter("productId", productId).setParameter("productPath", productPath).getSingleResult();
  }

  @Override
  public Boolean isOthersHaveColorAndSize(UUID productId, Long variantId, String color, String size) {
    return this.entityManager.createQuery(
        "select case when (count(p) > 0)  then true else false end from products p INNER JOIN p.variants pv INNER JOIN pv.productSize ps WHERE p.productId = :productId AND pv.variantColor = :color AND ps.productSizeName = :size AND pv.variantId != :variantId",
        Boolean.class).setParameter("productId", productId).setParameter("variantId", variantId)
        .setParameter("color", color).setParameter("size", size).getSingleResult();
  }

  @Override
  public Boolean isOthersHaveName(UUID productId, String productName) {
    return this.entityManager.createQuery(
        "select case when (count(u) > 0)  then true else false end from products u where u.productName = :productName and u.productId != :productId",
        Boolean.class).setParameter("productId", productId).setParameter("productName", productName).getSingleResult();
  }

  @Override
  public Page<Product> findAllToAvoidNPlusOne(Specification<Product> spec, Pageable pageable) {

    /**
     * CriteriaQuery & TypedQuery version.
     *
     * - to integrate with JPA specification and pageable
     **/

    List<Product> products;

    /**
     * for variants fetching
     **/
    CriteriaBuilder cBuilder = this.entityManager.getCriteriaBuilder();
    CriteriaQuery<Product> cQuery = cBuilder.createQuery(Product.class);
    Root<Product> root = cQuery.from(Product.class);
    root.fetch("variants", JoinType.LEFT).fetch("productSize", JoinType.LEFT);
    root.fetch("category", JoinType.LEFT);
    if (spec != null) {
      logger.info("inside variants fetching specificaiton");
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    TypedQuery<Product> tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int) pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    products = tQuery.getResultList();

    /**
     * for reviews fetching
     **/
    cQuery = cBuilder.createQuery(Product.class);
    root = cQuery.from(Product.class);
    root.fetch("reviews", JoinType.LEFT).fetch("user", JoinType.LEFT).fetch("userType", JoinType.LEFT);
    cQuery.distinct(true);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int) pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    products = tQuery.getResultList();

    /**
     * for productImages fetching
     **/
    cQuery = cBuilder.createQuery(Product.class);
    root = cQuery.from(Product.class);
    root.fetch("productImages", JoinType.LEFT);
    cQuery.distinct(true);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int) pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    products = tQuery.getResultList();

    // total count without pagination
    List<Product> total = this.entityManager.createQuery(cQuery).getResultList();

    /**
     * TypedQuery version
     *
     * - ref: https://thorben-janssen.com/fix-multiplebagfetchexception-hibernate/
     * 
     **/
    // TypedQuery<Product> query = this.entityManager.createQuery("SELECT DISTINCT p
    // FROM products p JOIN FETCH p.variants pv JOIN FETCH pv.productSize s JOIN
    // FETCH p.category c", Product.class);
    // query.setHint(QueryHints.PASS_DISTINCT_THROUGH, false);
    // List<Product> products = query.getResultList();

    // query = this.entityManager.createQuery("SELECT DISTINCT p FROM products p
    // JOIN FETCH p.reviews r JOIN FETCH r.user u JOIN FETCH u.userType",
    // Product.class);
    // query.setHint(QueryHints.PASS_DISTINCT_THROUGH, false);
    // products = query.getResultList();

    // query = this.entityManager.createQuery("SELECT DISTINCT p FROM products p
    // JOIN FETCH p.productImages pi", Product.class);
    // query.setHint(QueryHints.PASS_DISTINCT_THROUGH, false);
    // products = query.getResultList();

    return new PageImpl<Product>(products, pageable, total.size());
  }

  @Override
  public void refresh(Product domain) {
    this.entityManager.refresh(domain);
  }

  @Override
  public Optional<ProductSize> findProductSizeById(Long id) {
    return this.entityManager
        .createQuery("SELECT ps FROM productSizes ps WHERE ps.productSizeId = :id", ProductSize.class)
        .setParameter("id", id).getResultList().stream().findFirst();
  }

  @Override
  public List<ProductVariant> findAllDiscountPassedVariants(LocalDateTime time) {
    return this.entityManager
        .createQuery("SELECT pv FROM productVariants pv WHERE pv.isDiscount = 1 AND pv.variantDiscountEndDate < :time", ProductVariant.class)
        .setParameter("time", time).getResultList();
  }

}
