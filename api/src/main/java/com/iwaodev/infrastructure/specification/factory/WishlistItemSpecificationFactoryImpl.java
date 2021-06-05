package com.iwaodev.infrastructure.specification.factory;

import com.iwaodev.application.specification.factory.ProductSpecificationFactory;
import com.iwaodev.application.specification.factory.WishlistItemSpecificationFactory;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.WishlistItem;
import com.iwaodev.infrastructure.specification.ProductSpecifications;
import com.iwaodev.infrastructure.specification.WishlistItemSpecifications;
import com.iwaodev.ui.criteria.ProductQueryStringCriteria;
import com.iwaodev.ui.criteria.WishlistItemQueryStringCriteria;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class WishlistItemSpecificationFactoryImpl implements WishlistItemSpecificationFactory {

  private WishlistItemSpecifications specifications;

  @Autowired
  public WishlistItemSpecificationFactoryImpl(WishlistItemSpecifications specifications) {
    this.specifications = specifications;
  }

	@Override
	public Specification<WishlistItem> build(WishlistItemQueryStringCriteria criteria) {
    return this.specifications.isBlongToUserOf(criteria.getUserId())
      .and(this.specifications.lessThanEqualWishlistItemPrice(criteria.getMaxPrice()))
      .and(this.specifications.moreThanEqualWishlistItemPrice(criteria.getMinPrice()))
      .and(this.specifications.isGreaterThanReviewPointOf(criteria.getReviewPoint()))
      .and(this.specifications.releaseDateAfter(criteria.getStartDate()))
      .and(this.specifications.releaseDateBefore(criteria.getEndDate()))
      .and(
          this.specifications.isWishlistItemDiscount(criteria.getIsDiscount())
          )
      .and(
          this.specifications.searchQueryByWishlistItemName(criteria.getSearchQuery())
            .or(this.specifications.searchQueryByWishlistItemDescription(criteria.getSearchQuery()))
          );
	}
}

