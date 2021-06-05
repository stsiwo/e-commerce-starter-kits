package com.iwaodev.application.iservice;

import java.util.UUID;

import com.iwaodev.application.dto.wishlistItem.WishlistItemDTO;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.ui.criteria.WishlistItemQueryStringCriteria;

import org.springframework.data.domain.Page;

public interface UserWishlistItemService {

  public Page<WishlistItemDTO> getAll(WishlistItemQueryStringCriteria criteria, Integer page, Integer limit, ProductSortEnum sort);

  public WishlistItemDTO add(UUID userId, Long variantId);

  public void moveToCart(UUID userId, Long wishlistItemId);

  public void remove(Long cartItemId);

  public void deleteAll(UUID userId);

}




