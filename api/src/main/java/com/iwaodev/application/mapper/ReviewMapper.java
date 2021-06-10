package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.review.ProductDTO;
import com.iwaodev.application.dto.review.ReviewDTO;
import com.iwaodev.application.dto.review.UserDTO;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.review.ReviewCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ReviewMapper {

  ReviewMapper INSTANCE = Mappers.getMapper( ReviewMapper.class );

  ReviewDTO toReviewDTO(Review review);

  Review toReviewEntityFromReviewCriteria(ReviewCriteria review);

  // for sub entity esp for /users/{userId}/review to find a review.
  UserDTO toUserDTO(User user);
  ProductDTO toProductDTO(Product product);

}
