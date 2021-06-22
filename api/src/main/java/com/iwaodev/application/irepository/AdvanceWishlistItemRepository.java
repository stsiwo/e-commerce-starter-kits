package com.iwaodev.application.irepository;

import com.iwaodev.infrastructure.model.WishlistItem;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface AdvanceWishlistItemRepository {

  public Page<WishlistItem> findAllToAvoidNPlusOne(Specification<WishlistItem> spec, Pageable pageable);
}
