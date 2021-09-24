package com.iwaodev.infrastructure.repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;

import com.iwaodev.application.irepository.AdvanceOrderRepository;
import com.iwaodev.infrastructure.model.Order;

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
@Component("orderRepositoryImpl") // must be target repository implementation name
public class AdvanceOrderRepositoryImpl implements AdvanceOrderRepository {

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public Page<Order> findAllToAvoidNPlusOne(Specification<Order> spec, Pageable pageable) {

    /**
     * CriteriaQuery & TypedQuery version.
     *
     *  - to integrate with JPA specification and pageable
     *
     *  - questions:
     *    - TODO: how to do deep nested association.
     *
     *      e.g., when try to join fetch "orderDetails.product.variants" => also get "MultipleBagsException" how to deal with this case?
     **/

    List<Order> orders;

    /**
     * for variants fetching
     **/
    CriteriaBuilder cBuilder = this.entityManager.getCriteriaBuilder();
    CriteriaQuery<Order> cQuery = cBuilder.createQuery(Order.class);
    Root<Order> root = cQuery.from(Order.class);
    root.fetch("orderEvents", JoinType.LEFT).fetch("user", JoinType.LEFT).fetch("userType", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    TypedQuery<Order> tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    orders = tQuery.getResultList();

    cQuery = cBuilder.createQuery(Order.class);
    root = cQuery.from(Order.class);
    root.fetch("orderDetails", JoinType.LEFT).fetch("product", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    orders = tQuery.getResultList();

    cQuery = cBuilder.createQuery(Order.class);
    root = cQuery.from(Order.class);
    root.fetch("orderDetails", JoinType.LEFT).fetch("productVariant", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    orders = tQuery.getResultList();

    // total count without pagination
    List<Order> total = this.entityManager.createQuery(cQuery).getResultList();

    //return new PageImpl<Order>(orders, pageable, totalCount);
    return new PageImpl<Order>(orders, pageable, total.size());
  }

  @Override
  public Order persist(Order order) {
    this.entityManager.persist(order);
    return order;
  }

  public Long getTotalCount() {
    return this.entityManager.createQuery("SELECT COUNT(*) FROM categories c", Long.class)
      .getSingleResult();
  }
}
