package com.iwaodev.application.service;

import java.util.Optional;
import java.util.function.Function;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.application.irepository.CategoryRepository;
import com.iwaodev.application.iservice.CategoryService;
import com.iwaodev.application.mapper.CategoryMapper;
import com.iwaodev.application.specification.factory.CategorySpecificationFactory;
import com.iwaodev.domain.category.CategorySortEnum;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Category;
import com.iwaodev.ui.criteria.category.CategoryCriteria;
import com.iwaodev.ui.criteria.category.CategoryQueryStringCriteria;

import com.iwaodev.util.Util;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

  private static final Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);

  @Autowired
  private CategoryRepository repository;

  @Autowired
  private CategorySpecificationFactory specificationFactory;

  @Autowired
  private HttpServletRequest httpServletRequest;

  public Page<CategoryDTO> getAll(CategoryQueryStringCriteria criteria, Integer page, Integer limit,
      CategorySortEnum sort) throws Exception {

    // get result with repository
    // and map entity to dto with MapStruct
    return this.repository
        .findAllToAvoidNPlusOne(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
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
  public CategoryDTO create(CategoryCriteria criteria) throws Exception {

    // map criteria to entity
    Category newEntity = CategoryMapper.INSTANCE.toCategoryEntityFromCategoryCriteria(criteria);

    // duplication check
    if (this.repository.findByCategoryName(newEntity.getCategoryName()).isPresent()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the category name already taken.");
    }

    if (this.repository.findByCategoryPath(newEntity.getCategoryPath()).isPresent()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the category path already taken.");
    }
    // save it
    Category savedEntity = this.repository.save(newEntity);

    // map entity to dto and return it.
    return CategoryMapper.INSTANCE.toCategoryDTO(savedEntity);
  }

  @Override
  public CategoryDTO update(CategoryCriteria criteria, Long id) throws Exception {
    // get result with repository
    // and map entity to dto with MapStruct
    Optional<Category> targetEntityOption = this.repository.findById(id);

    if (!targetEntityOption.isPresent()) {
      logger.debug("the given address does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given address does not exist.");
    }

    Category category = targetEntityOption.get();

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(category.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    // duplication check
    if (this.repository.isOthersHaveName(category.getCategoryId(), criteria.getCategoryName())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the category name already taken.");
    }

    if (this.repository.isOthersHavePath(category.getCategoryId(), criteria.getCategoryPath())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the category path already taken.");
    }

    // make sure criteria.categoryId is assigned
    if (criteria.getCategoryId() == null) {
      criteria.setCategoryId(id);
    }

    // map criteria to entity
    // issue-k0rdIGEQ91U
    Category updateEntity = CategoryMapper.INSTANCE.toCategoryEntityFromCategoryCriteria(criteria);
    category.update(updateEntity);

    Category updatedCategory;
    try {
      // save it
      // issue-j845jixIPCn
      // don't forget flush otherwise version number is updated.
      updatedCategory = this.repository.saveAndFlush(category);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    // map entity to dto and return it.
    return CategoryMapper.INSTANCE.toCategoryDTO(updatedCategory);
  }

  @Override
  public void delete(Long id) throws Exception {

    // completely delete user data
    Optional<Category> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isPresent()) {
      Category targetEntity = targetEntityOption.get();

      // version check for concurrency update
      String receivedVersion = this.httpServletRequest.getHeader("If-Match");
      if (receivedVersion == null || receivedVersion.isEmpty()) {
        throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
      }
      if (!Util.checkETagVersion(targetEntity.getVersion(), receivedVersion)) {
        throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
      };

      if (targetEntity.getProducts().size() > 0) {
        throw new AppException(HttpStatus.BAD_REQUEST, "cannot delete this category since it has products.");
      }
      try {
        this.repository.delete(targetEntity);
      } catch (OptimisticLockingFailureException ex) {
        throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
      }
    }
  }
}
