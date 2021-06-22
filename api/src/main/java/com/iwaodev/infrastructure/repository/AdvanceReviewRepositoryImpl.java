package com.iwaodev.infrastructure.repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;

import com.iwaodev.application.irepository.AdvanceReviewRepository;
import com.iwaodev.infrastructure.model.Review;

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
@Component("reviewRepositoryImpl") // must be target repository implementation name
public class AdvanceReviewRepositoryImpl implements AdvanceReviewRepository {

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public Page<Review> findAllToAvoidNPlusOne(Specification<Review> spec, Pageable pageable) {

    /**
     * CriteriaQuery & TypedQuery version.
     *
     *  - to integrate with JPA specification and pageable
     **/

    List<Review> reviews;

    /**
     * for variants fetching
     **/
    CriteriaBuilder cBuilder = this.entityManager.getCriteriaBuilder();
    CriteriaQuery<Review> cQuery = cBuilder.createQuery(Review.class);
    Root<Review> root = cQuery.from(Review.class);
    root.fetch("user", JoinType.LEFT).fetch("userType", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    TypedQuery<Review> tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    reviews = tQuery.getResultList();

    cQuery = cBuilder.createQuery(Review.class);
    root = cQuery.from(Review.class);
    root.fetch("product", JoinType.LEFT).fetch("variants", JoinType.LEFT).fetch("productSize", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    reviews = tQuery.getResultList();

    cQuery = cBuilder.createQuery(Review.class);
    root = cQuery.from(Review.class);
    root.fetch("product", JoinType.LEFT).fetch("productImages", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    reviews = tQuery.getResultList();

    // total count without pagination
    List<Review> total = this.entityManager.createQuery(cQuery).getResultList();

    //return new PageImpl<Review>(reviews, pageable, totalCount);
    return new PageImpl<Review>(reviews, pageable, total.size());
  }

  public Long getTotalCount() {
    return this.entityManager.createQuery("SELECT COUNT(*) FROM categories c", Long.class)
      .getSingleResult();
  }
}
