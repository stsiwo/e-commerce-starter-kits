package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.productVariant.ProductVariantDTO;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.ui.criteria.ProductVariantCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProductVariantMapper {

  ProductVariantMapper INSTANCE = Mappers.getMapper( ProductVariantMapper.class );

  @Mapping(source = "productVariant.product.productId", target = "productId")
  ProductVariantDTO toProductVariantDTO(ProductVariant productVariant);

  ProductVariant toProductVariantEntityFromProductVariantCriteria(ProductVariantCriteria productVariant);

}
