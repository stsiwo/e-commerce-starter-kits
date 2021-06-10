package com.iwaodev.application.iservice;

import java.util.UUID;

import com.iwaodev.application.dto.review.FindReviewDTO;
import com.iwaodev.application.dto.review.ReviewDTO;
import com.iwaodev.domain.review.ReviewSortEnum;
import com.iwaodev.ui.criteria.review.ReviewCriteria;
import com.iwaodev.ui.criteria.review.ReviewQueryStringCriteria;

import org.springframework.data.domain.Page;

public interface ReviewService {

  public Page<ReviewDTO> getAll(ReviewQueryStringCriteria criteria, Integer page, Integer limit, ReviewSortEnum sort);

  public ReviewDTO getById(Long id);

  public ReviewDTO create(ReviewCriteria criteria);

  public ReviewDTO update(ReviewCriteria criteria, Long id);

  public void delete(Long id);

  public FindReviewDTO findByUserIdAndProductId(UUID userId, UUID productId);
}



