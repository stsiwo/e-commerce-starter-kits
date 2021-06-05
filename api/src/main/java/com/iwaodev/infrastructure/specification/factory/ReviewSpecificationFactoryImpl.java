package com.iwaodev.infrastructure.specification.factory;

import com.iwaodev.application.specification.factory.ProductSpecificationFactory;
import com.iwaodev.application.specification.factory.ReviewSpecificationFactory;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.infrastructure.specification.ProductSpecifications;
import com.iwaodev.infrastructure.specification.ReviewSpecifications;
import com.iwaodev.ui.criteria.ProductQueryStringCriteria;
import com.iwaodev.ui.criteria.review.ReviewQueryStringCriteria;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class ReviewSpecificationFactoryImpl implements ReviewSpecificationFactory {

  private ReviewSpecifications specifications;

  @Autowired
  public ReviewSpecificationFactoryImpl(ReviewSpecifications specifications) {
    this.specifications = specifications;
  }

	@Override
	public Specification<Review> build(ReviewQueryStringCriteria criteria) {
    return this.specifications.isBlongToUserOf(criteria.getUserId())
      .and(this.specifications.isBlongToProductOf(criteria.getProductId()))
      .and(this.specifications.isGreaterThanReviewPointOf(criteria.getReviewPoint()))
      .and(this.specifications.isVerify(criteria.getIsVerified()))
      .and(this.specifications.createdDateAfter(criteria.getStartDate()))
      .and(this.specifications.createdDateBefore(criteria.getEndDate()))
      .and(
          this.specifications.searchQueryByReviewTitle(criteria.getSearchQuery())
            .or(this.specifications.searchQueryByReviewDescription(criteria.getSearchQuery()))
            .or(this.specifications.searchQueryByUserId(criteria.getSearchQuery()))
            .or(this.specifications.searchQueryByProductId(criteria.getSearchQuery()))
          );
	}
}

