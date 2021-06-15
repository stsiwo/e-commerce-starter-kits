package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.ui.criteria.product.ProductCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProductMapper {

  ProductMapper INSTANCE = Mappers.getMapper( ProductMapper.class );

  // does not solve the circular dependencies. it gives me a hint which one is circular dependency.
  //ProductDTO toProductDTO(Product product, @Context CycleAvoidingMappingContext context);
  ProductDTO toProductDTO(Product product);

  Product toProductEntityFromProductCriteria(ProductCriteria product);

}
