package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.cartItem.CartItemDTO;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.ui.criteria.cartItem.CartItemCriteria;

public interface UserCartItemService {

  public List<CartItemDTO> getAll(UUID userId) throws Exception;

  public CartItemDTO add(CartItemCriteria criteria) throws Exception;

  public CartItemDTO update(CartItemCriteria criteria) throws Exception;

  public void remove(Long cartItemId) throws Exception;

  public void deleteAll(UUID userId) throws Exception;

}



