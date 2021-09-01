package com.iwaodev.infrastructure.specification.factory;

import com.iwaodev.application.specification.factory.ProductSpecificationFactory;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.specification.ProductSpecifications;
import com.iwaodev.ui.criteria.product.ProductQueryStringCriteria;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class ProductSpecificationFactoryImpl implements ProductSpecificationFactory {

  private ProductSpecifications specifications;

  @Autowired
  public ProductSpecificationFactoryImpl(ProductSpecifications specifications) {
    this.specifications = specifications;
  }

	@Override
	public Specification<Product> build(ProductQueryStringCriteria criteria) {
    return this.specifications.lessThanEqualProductPrice(criteria.getMaxPrice())
      .and(this.specifications.moreThanEqualProductPrice(criteria.getMinPrice()))
      .and(this.specifications.isBlongToCategoryOf(criteria.getCategoryId()))
      .and(this.specifications.isPublicOfThisProduct(criteria.getIsPublic()))
      .and(this.specifications.isGreaterThanReviewPointOf(criteria.getReviewPoint()))
      .and(this.specifications.releaseDateAfter(criteria.getStartDate()))
      .and(this.specifications.releaseDateBefore(criteria.getEndDate()))
      .and(this.specifications.isAnyVariantOfThisProductDiscount(criteria.getIsDiscount()))
      .and(
          this.specifications.searchQueryByProductName(criteria.getSearchQuery())
            .or(this.specifications.searchQueryByProductDescription(criteria.getSearchQuery()))
                  .or(this.specifications.searchQueryByProductId(criteria.getSearchQuery()))
          );
	}
}

