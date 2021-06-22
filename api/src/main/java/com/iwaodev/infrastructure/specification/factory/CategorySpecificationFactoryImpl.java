package com.iwaodev.infrastructure.specification.factory;

import com.iwaodev.application.specification.factory.CategorySpecificationFactory;
import com.iwaodev.infrastructure.model.Category;
import com.iwaodev.infrastructure.specification.CategorySpecifications;
import com.iwaodev.ui.criteria.category.CategoryQueryStringCriteria;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class CategorySpecificationFactoryImpl implements CategorySpecificationFactory {

  private CategorySpecifications specifications;

  @Autowired
  public CategorySpecificationFactoryImpl(CategorySpecifications specifications) {
    this.specifications = specifications;
  }

	@Override
	public Specification<Category> build(CategoryQueryStringCriteria criteria) {
    return this.specifications.searchQueryByCategoryName(criteria.getSearchQuery())
      .or(this.specifications.searchQueryByCategoryDescription(criteria.getSearchQuery()));
	}
}

