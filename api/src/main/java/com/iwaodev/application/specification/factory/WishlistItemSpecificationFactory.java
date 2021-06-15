package com.iwaodev.application.specification.factory;

import com.iwaodev.infrastructure.model.WishlistItem;
import com.iwaodev.ui.criteria.wishlistItem.WishlistItemQueryStringCriteria;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public interface WishlistItemSpecificationFactory {

  public Specification<WishlistItem> build(WishlistItemQueryStringCriteria criteria); 
}



