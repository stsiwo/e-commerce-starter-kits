package com.iwaodev.infrastructure.repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;

import com.iwaodev.application.irepository.AdvanceCategoryRepository;
import com.iwaodev.infrastructure.model.Category;

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
@Component("categoryRepositoryImpl") // must be target repository implementation name
public class AdvanceCategoryRepositoryImpl implements AdvanceCategoryRepository {

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public Page<Category> findAllToAvoidNPlusOne(Specification<Category> spec, Pageable pageable) {

    /**
     * CriteriaQuery & TypedQuery version.
     *
     * - to integrate with JPA specification and pageable
     **/

    List<Category> categorys;

    /**
     * for variants fetching
     **/
    CriteriaBuilder cBuilder = this.entityManager.getCriteriaBuilder();
    CriteriaQuery<Category> cQuery = cBuilder.createQuery(Category.class);
    Root<Category> root = cQuery.from(Category.class);
    root.fetch("products", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    TypedQuery<Category> tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int) pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    categorys = tQuery.getResultList();

    // total count without pagination
    List<Category> total = this.entityManager.createQuery(cQuery).getResultList();

    // return new PageImpl<Category>(categorys, pageable, totalCount);
    return new PageImpl<Category>(categorys, pageable, total.size());
  }

  public Long getTotalCount() {
    return this.entityManager.createQuery("SELECT COUNT(*) FROM categories c", Long.class).getSingleResult();
  }

  @Override
  public Boolean isOthersHaveName(Long categoryId, String categoryName) {
		return this.entityManager.createQuery("select case when (count(u) > 0)  then true else false end from categories u where u.categoryName = :categoryName and u.categoryId != :categoryId", Boolean.class)
      .setParameter("categoryId", categoryId)
      .setParameter("categoryName", categoryName)
      .getSingleResult();
  }

  @Override
  public Boolean isOthersHavePath(Long categoryId, String categoryPath) {
		return this.entityManager.createQuery("select case when (count(u) > 0)  then true else false end from categories u where u.categoryPath = :categoryPath and u.categoryId != :categoryId", Boolean.class)
      .setParameter("categoryId", categoryId)
      .setParameter("categoryPath", categoryPath)
      .getSingleResult();
  }
}
