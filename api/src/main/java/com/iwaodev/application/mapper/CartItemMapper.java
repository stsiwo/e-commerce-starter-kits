package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.cartItem.CartItemDTO;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.infrastructure.model.CartItem;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.ui.criteria.cartItem.CartItemCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CartItemMapper {

  CartItemMapper INSTANCE = Mappers.getMapper( CartItemMapper.class );

  /**
   * custom mapping property.
   *
   * ex)
   * source) List<Product> products ===> transform @Named function ===> Integer totalProductCount (target
   * 
   *
   **/
  @Named("variantToProduct")
    public static ProductDTO variantToProduct(ProductVariant variant) {
        return ProductMapper.INSTANCE.toProductDTO(variant.getProduct()); 
    }

  @Mapping(source = "variant", target = "product", qualifiedByName = "variantToProduct")
  CartItemDTO toCartItemDTO(CartItem cartitem);

  CartItem toCartItemEntityFromCartItemCriteria(CartItemCriteria cartitem);


}


