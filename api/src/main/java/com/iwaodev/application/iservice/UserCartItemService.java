package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.cartItem.CartItemDTO;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.ui.criteria.CartItemCriteria;

public interface UserCartItemService {

  public List<CartItemDTO> getAll(UUID userId);

  public CartItemDTO add(CartItemCriteria criteria);

  public CartItemDTO update(CartItemCriteria criteria);

  public void remove(Long cartItemId);

  public void deleteAll(UUID userId);

}



