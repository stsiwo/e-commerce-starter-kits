package com.iwaodev.application.specification.factory;

import com.iwaodev.infrastructure.model.Category;
import com.iwaodev.ui.criteria.CategoryQueryStringCriteria;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public interface CategorySpecificationFactory {

  public Specification<Category> build(CategoryQueryStringCriteria criteria); 
}


