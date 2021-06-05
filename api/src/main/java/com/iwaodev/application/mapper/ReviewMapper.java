package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.review.ReviewDTO;
import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.ui.criteria.review.ReviewCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ReviewMapper {

  ReviewMapper INSTANCE = Mappers.getMapper( ReviewMapper.class );

  ReviewDTO toReviewDTO(Review review);

  Review toReviewEntityFromReviewCriteria(ReviewCriteria review);

}
