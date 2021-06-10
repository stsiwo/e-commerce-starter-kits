package com.iwaodev.application.service;

import java.util.Optional;
import java.util.function.Function;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.application.irepository.CategoryRepository;
import com.iwaodev.application.iservice.CategoryService;
import com.iwaodev.application.mapper.CategoryMapper;
import com.iwaodev.application.specification.factory.CategorySpecificationFactory;
import com.iwaodev.domain.category.CategorySortEnum;
import com.iwaodev.infrastructure.model.Category;
import com.iwaodev.ui.criteria.CategoryCriteria;
import com.iwaodev.ui.criteria.CategoryQueryStringCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

  private static final Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);

  private CategoryRepository repository;

  private CategorySpecificationFactory specificationFactory;

  @Autowired
  public CategoryServiceImpl(CategoryRepository repository, CategorySpecificationFactory specificationFactory) {
    this.repository = repository;
    this.specificationFactory = specificationFactory;
  }

  public Page<CategoryDTO> getAll(CategoryQueryStringCriteria criteria, Integer page, Integer limit,
      CategorySortEnum sort) {

    // get result with repository
    // and map entity to dto with MapStruct
    return this.repository
        .findAll(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
        .map(new Function<Category, CategoryDTO>() {

          @Override
          public CategoryDTO apply(Category category) {
            return CategoryMapper.INSTANCE.toCategoryDTO(category);
          }
        });

  }

  private Sort getSort(CategorySortEnum sortEnum) {

    if (sortEnum == CategorySortEnum.ALPHABETIC_ASC) {
      return Sort.by("categoryName").ascending();
    } else {
      return Sort.by("categoryName").descending();
    }
  }

  @Override
  public CategoryDTO create(CategoryCriteria criteria) {

    // map criteria to entity
    Category newEntity = CategoryMapper.INSTANCE.toCategoryEntityFromCategoryCriteria(criteria);

    // save it
    this.repository.save(newEntity);

    // map entity to dto and return it.
    return CategoryMapper.INSTANCE.toCategoryDTO(newEntity);
  }

  @Override
  public CategoryDTO update(CategoryCriteria criteria, Long id) {
    // get result with repository
    // and map entity to dto with MapStruct
    Optional<Category> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given address does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given address does not exist.");
    }

    // make sure criteria.categoryId is assigned
    if (criteria.getCategoryId() == null) {
      criteria.setCategoryId(id);
    }

    // map criteria to entity
    Category updateEntity = CategoryMapper.INSTANCE.toCategoryEntityFromCategoryCriteria(criteria);

    // save it
    this.repository.save(updateEntity);

    // map entity to dto and return it.
    return CategoryMapper.INSTANCE.toCategoryDTO(updateEntity);
  }

  @Override
  public void delete(Long id) {

    // completely delete user data
    Optional<Category> targetEntityOption = this.repository.findById(id);

    if (!targetEntityOption.isEmpty()) {
      Category targetEntity = targetEntityOption.get();
      this.repository.delete(targetEntity);
    }
  }
}
