package com.iwaodev.application.irepository;

import com.iwaodev.infrastructure.model.Category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface AdvanceCategoryRepository {

  public Page<Category> findAllToAvoidNPlusOne(Specification<Category> spec, Pageable pageable);

  /**
   * check if email exists ecept for this userId
   **/
  public Boolean isOthersHaveName(Long categoryId, String categoryName);

  /**
   * check if email exists ecept for this userId
   **/
  public Boolean isOthersHavePath(Long categoryId, String categoryPath);
}
