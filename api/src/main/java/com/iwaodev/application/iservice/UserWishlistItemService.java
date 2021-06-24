package com.iwaodev.application.iservice;

import java.util.UUID;

import com.iwaodev.application.dto.wishlistItem.WishlistItemDTO;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.ui.criteria.wishlistItem.WishlistItemQueryStringCriteria;

import org.springframework.data.domain.Page;

public interface UserWishlistItemService {

  public Page<WishlistItemDTO> getAll(WishlistItemQueryStringCriteria criteria, Integer page, Integer limit, ProductSortEnum sort) throws Exception;

  public WishlistItemDTO add(UUID userId, Long variantId) throws Exception;

  public void moveToCart(UUID userId, Long wishlistItemId) throws Exception;

  public void remove(Long cartItemId) throws Exception;

  public void deleteAll(UUID userId) throws Exception;

}




