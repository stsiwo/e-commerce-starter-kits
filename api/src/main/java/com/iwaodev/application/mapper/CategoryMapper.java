package com.iwaodev.application.mapper;

import java.util.List;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.infrastructure.model.Category;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.ui.criteria.CategoryCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CategoryMapper {

  CategoryMapper INSTANCE = Mappers.getMapper( CategoryMapper.class );

  /**
   * custom mapping property.
   *
   * ex)
   * source) List<Product> products ===> transform @Named function ===> Integer totalProductCount (target
   * 
   *
   **/
  @Named("productListToCount")
    public static Integer productListToCount(List<Product> products) {
        return products.size();
    }

  @Mapping(source = "products", target = "totalProductCount", qualifiedByName = "productListToCount")
  CategoryDTO toCategoryDTO(Category category);

  Category toCategoryEntityFromCategoryCriteria(CategoryCriteria category);


}

