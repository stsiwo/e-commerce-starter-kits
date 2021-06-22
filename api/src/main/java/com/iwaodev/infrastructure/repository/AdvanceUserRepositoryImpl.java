package com.iwaodev.infrastructure.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;

import com.iwaodev.application.irepository.AdvanceUserRepository;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.model.UserType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;


/**
 * any custom repository implementation must be registered with its target repository implementation name.
 *
 *
 * see note.md#CustomizedRepositoryImplementation more detail.
 *
 **/
@Component("userRepositoryImpl") // must be target repository implementation name
public class AdvanceUserRepositoryImpl implements AdvanceUserRepository {

  @PersistenceContext
  private EntityManager entityManager;

	@Override
	public Optional<UserType> findUserType(UserTypeEnum type) {
		return this.entityManager.createQuery("SELECT ut FROM user_types ut WHERE ut.userType = :userType", UserType.class)
      .setParameter("userType", type)
      .getResultList()
      .stream()
      .findFirst();
	}

	@Override
	public Boolean isDuplicateEmail(String email) {
		return this.entityManager.createQuery("select case when (count(u) > 0)  then true else false end from users u where u.email = :email", Boolean.class)
      .setParameter("email", email)
      .getSingleResult();
	}

	@Override
	public Boolean isOthersHaveEmail(UUID userId, String email) {
		return this.entityManager.createQuery("select case when (count(u) > 0)  then true else false end from users u where u.email = :email and u.userId != :userId", Boolean.class)
      .setParameter("email", email)
      .setParameter("userId", userId)
      .getSingleResult();
	}

	@Override
	public Page<User> findAllToAvoidNPlusOne(Specification<User> spec, Pageable pageable) {
    /**
     * CriteriaQuery & TypedQuery version.
     *
     *  - to integrate with JPA specification and pageable
     **/

    List<User> users;

    /**
     **/
    CriteriaBuilder cBuilder = this.entityManager.getCriteriaBuilder();
    CriteriaQuery<User> cQuery = cBuilder.createQuery(User.class);
    Root<User> root = cQuery.from(User.class);
    root.fetch("userType", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    TypedQuery<User> tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    users = tQuery.getResultList();

    /**
     **/
    cQuery = cBuilder.createQuery(User.class);
    root = cQuery.from(User.class);
    root.fetch("phones", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    users = tQuery.getResultList();

    /**
     **/
    cQuery = cBuilder.createQuery(User.class);
    root = cQuery.from(User.class);
    root.fetch("addresses", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    users = tQuery.getResultList();

    /**
     **/
    cQuery = cBuilder.createQuery(User.class);
    root = cQuery.from(User.class);
    root.fetch("companies", JoinType.LEFT);
    if (spec != null) {
      cQuery.where(spec.toPredicate(root, cQuery, cBuilder));
    }
    cQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cBuilder));
    cQuery.distinct(true);
    tQuery = this.entityManager.createQuery(cQuery);
    tQuery.setFirstResult((int)pageable.getOffset());
    tQuery.setMaxResults(pageable.getPageSize());
    users = tQuery.getResultList();

    // total count without pagination
    List<User> total = this.entityManager.createQuery(cQuery).getResultList();

    //return new PageImpl<User>(users, pageable, totalCount);
    return new PageImpl<User>(users, pageable, total.size());
	}

}
