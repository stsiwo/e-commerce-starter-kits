package com.iwaodev.application.specification.factory;

import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.ui.criteria.review.ReviewQueryStringCriteria;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public interface ReviewSpecificationFactory {

  public Specification<Review> build(ReviewQueryStringCriteria criteria); 
}


