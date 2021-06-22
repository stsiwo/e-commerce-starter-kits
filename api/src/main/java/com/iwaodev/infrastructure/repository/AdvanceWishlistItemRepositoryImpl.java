package com.iwaodev.infrastructure.repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;

import com.iwaodev.application.irepository.AdvanceWishlistItemRepository;
import com.iwaodev.infrastructure.model.WishlistItem;

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
@Component("wishlistItemRepositoryImpl") // must be target repository implementation name
public class AdvanceWishlistItemRepositoryImpl implements AdvanceWishlistItemRepository {

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public Page<WishlistItem> findAllToAvoidNPlusOne(Specification<WishlistItem> spec, Pageable pageable) {

    /**
     * CriteriaQuery & TypedQuery version.
     *
     *  - to integrate with JPA specification and pageable
     *
     *  - questions:
     *    - TODO: how to do deep nested association.
     *
     *      e.g., when try to join fetch "wishlistItemDetails.product.variants" => also get "MultipleBagsException" how to deal with this case?
     **/

    List<WishlistItem> wishlistItems;

    /**
     * for variants fetching
     **/
    CriteriaBuilder cBuilder = this.entityManager.getCriteriaBuilder();
    CriteriaQuery<WishlistItem> cQuery = cBuilder.createQuery(WishlistItem.class);
    Root<WishlistItem> root = cQuery.from(WishlistItem.class);
    root.fetch("user", JoinType.LEFT).fetch("userType", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    TypedQuery<WishlistItem> tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    wishlistItems = tQuery.getResultList();

    cQuery = cBuilder.createQuery(WishlistItem.class);
    root = cQuery.from(WishlistItem.class);
    root.fetch("variant", JoinType.LEFT).fetch("productSize", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    wishlistItems = tQuery.getResultList();

    cQuery = cBuilder.createQuery(WishlistItem.class);
    root = cQuery.from(WishlistItem.class);
    root.fetch("variant", JoinType.LEFT).fetch("product", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    wishlistItems = tQuery.getResultList();

    cQuery = cBuilder.createQuery(WishlistItem.class);
    root = cQuery.from(WishlistItem.class);
    root.fetch("variant", JoinType.LEFT).fetch("product", JoinType.LEFT).fetch("variants", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    wishlistItems = tQuery.getResultList();

    cQuery = cBuilder.createQuery(WishlistItem.class);
    root = cQuery.from(WishlistItem.class);
    root.fetch("variant", JoinType.LEFT).fetch("product", JoinType.LEFT).fetch("productImages", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    wishlistItems = tQuery.getResultList();

    cQuery = cBuilder.createQuery(WishlistItem.class);
    root = cQuery.from(WishlistItem.class);
    root.fetch("variant", JoinType.LEFT).fetch("product", JoinType.LEFT).fetch("reviews", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    wishlistItems = tQuery.getResultList();

    // total count without pagination
    List<WishlistItem> total = this.entityManager.createQuery(cQuery).getResultList();

    //return new PageImpl<WishlistItem>(wishlistItems, pageable, totalCount);
    return new PageImpl<WishlistItem>(wishlistItems, pageable, total.size());
  }

  public Long getTotalCount() {
    return this.entityManager.createQuery("SELECT COUNT(*) FROM categories c", Long.class)
      .getSingleResult();
  }
}
