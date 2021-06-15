package com.iwaodev.application.iservice;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.domain.category.CategorySortEnum;
import com.iwaodev.ui.criteria.category.CategoryCriteria;
import com.iwaodev.ui.criteria.category.CategoryQueryStringCriteria;

import org.springframework.data.domain.Page;

public interface CategoryService {

  public Page<CategoryDTO> getAll(CategoryQueryStringCriteria criteria, Integer page, Integer limit, CategorySortEnum sort);

  public CategoryDTO create(CategoryCriteria criteria);

  public CategoryDTO update(CategoryCriteria criteria, Long id);

  public void delete(Long id);

}

