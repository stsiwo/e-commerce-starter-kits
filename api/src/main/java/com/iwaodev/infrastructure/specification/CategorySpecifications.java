package com.iwaodev.infrastructure.specification;

import com.iwaodev.infrastructure.model.Category;
import com.iwaodev.infrastructure.model.Category_;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class CategorySpecifications {

  public static Specification<Category> searchQueryByCategoryName(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use 'conjunction()' 
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(Category_.categoryName), "%" + searchQuery + "%");
    };
  }

  public static Specification<Category> searchQueryByCategoryDescription(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use 'conjunction()' 
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(Category_.categoryDescription), "%" + searchQuery + "%");
    };
  }
}

