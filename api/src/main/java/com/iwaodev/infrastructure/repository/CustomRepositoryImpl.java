package com.iwaodev.infrastructure.repository;

import java.io.Serializable;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

//@NoRepositoryBean
//public class CustomRepositoryImpl<T, ID extends Serializable> extends SimpleJpaRepository<T, ID> implements CustomRepository<T, ID> {
//
//    private EntityManager em;
//
//    public CustomRepositoryImpl(Class<T> domainClass, EntityManager em) {
//        super(domainClass, em);
//        this.em = em;
//    }
//
//    @Override
//    public List<T> findAll(Specification<T> spec, EntityGraph.EntityGraphType entityGraphType, String entityGraphName) {
//        TypedQuery<T> query = getQuery(spec, (Sort) null);
//        query.setHint(entityGraphType.getKey(), em.getEntityGraph(entityGraphName));
//        return query.getResultList();
//    }
//
//    @Override
//    public Page<T> findAll(Specification<T> spec, Pageable pageable, EntityGraph.EntityGraphType entityGraphType, String entityGraphName) {
//        TypedQuery<T> query = getQuery(spec, pageable.getSort());
//        query.setHint(entityGraphType.getKey(), em.getEntityGraph(entityGraphName));
//        return readPage(query, getDomainClass(), pageable, spec); 
//    }
//
//    @Override
//    public List<T> findAll(Specification<T> spec, Sort sort, EntityGraph.EntityGraphType entityGraphType, String entityGraphName) {
//        TypedQuery<T> query = getQuery(spec, sort);
//        query.setHint(entityGraphType.getKey(), em.getEntityGraph(entityGraphName));
//        return query.getResultList();
//    }
//
//    @Override
//    public T findOne(Specification<T> spec, EntityGraph.EntityGraphType entityGraphType, String entityGraphName) {
//        TypedQuery<T> query = getQuery(spec, (Sort) null);
//        query.setHint(entityGraphType.getKey(), em.getEntityGraph(entityGraphName));
//        return query.getSingleResult();
//    }
//
//}
