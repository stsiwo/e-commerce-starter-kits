package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.infrastructure.model.Category;
import com.iwaodev.ui.criteria.CategoryCriteria;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:14-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryDTO toCategoryDTO(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryDTO categoryDTO = new CategoryDTO();

        categoryDTO.setTotalProductCount( CategoryMapper.productListToCount( category.getProducts() ) );
        categoryDTO.setCategoryId( category.getCategoryId() );
        categoryDTO.setCategoryName( category.getCategoryName() );
        categoryDTO.setCategoryDescription( category.getCategoryDescription() );
        categoryDTO.setCategoryPath( category.getCategoryPath() );

        return categoryDTO;
    }

    @Override
    public Category toCategoryEntityFromCategoryCriteria(CategoryCriteria category) {
        if ( category == null ) {
            return null;
        }

        Category category1 = new Category();

        category1.setCategoryId( category.getCategoryId() );
        category1.setCategoryName( category.getCategoryName() );
        category1.setCategoryDescription( category.getCategoryDescription() );
        category1.setCategoryPath( category.getCategoryPath() );

        return category1;
    }
}
