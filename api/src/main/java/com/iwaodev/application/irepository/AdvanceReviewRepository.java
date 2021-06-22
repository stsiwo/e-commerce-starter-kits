package com.iwaodev.application.irepository;

import com.iwaodev.infrastructure.model.Review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface AdvanceReviewRepository {

  public Page<Review> findAllToAvoidNPlusOne(Specification<Review> spec, Pageable pageable);
}
