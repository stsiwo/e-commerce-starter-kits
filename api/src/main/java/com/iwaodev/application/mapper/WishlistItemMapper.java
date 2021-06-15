package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.wishlistItem.WishlistItemDTO;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.infrastructure.model.WishlistItem;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.ui.criteria.wishlistItem.WishlistItemCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper
public interface WishlistItemMapper {

  WishlistItemMapper INSTANCE = Mappers.getMapper( WishlistItemMapper.class );

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
  WishlistItemDTO toWishlistItemDTO(WishlistItem wishlistItem);

  WishlistItem toWishlistItemEntityFromWishlistItemCriteria(WishlistItemCriteria wishlistItem);


}



