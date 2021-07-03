package com.iwaodev.infrastructure.specification;

import java.time.LocalDateTime;
import java.util.UUID;

import com.iwaodev.infrastructure.model.Product_;
import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.infrastructure.model.Review_;
import com.iwaodev.infrastructure.model.User_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class ReviewSpecifications {

  private static final Logger logger = LoggerFactory.getLogger(ReviewSpecifications.class);

  public static Specification<Review> isBlongToUserOf(UUID userId) {
    return (root, query, builder) -> {
      if (userId == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.equal(root.join(Review_.user).get(User_.userId), userId);
    };
  }

  public static Specification<Review> isBlongToProductOf(UUID productId) {
    return (root, query, builder) -> {
      if (productId == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.equal(root.join(Review_.product).get(Product_.productId), productId);
    };
  }

  public static Specification<Review> isGreaterThanReviewPointOf(Double reviewPoint) {
    return (root, query, builder) -> {
      if (reviewPoint == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.greaterThanOrEqualTo(root.get(Review_.reviewPoint), reviewPoint);
    };
  }


  public static Specification<Review> isVerify(Boolean isVerified) {
    return (root, query, builder) -> {
      if (isVerified == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.equal(root.get(Review_.isVerified), isVerified);
    };
  }

  public static Specification<Review> searchQueryByReviewTitle(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(Review_.reviewTitle), "%" + searchQuery + "%");
    };
  }

  public static Specification<Review> searchQueryByReviewDescription(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(Review_.reviewDescription), "%" + searchQuery + "%");
    };
  }

  public static Specification<Review> searchQueryByUserId(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.join(Review_.user).get(User_.userId).as(String.class), "%" + searchQuery + "%");
    };
  }

  public static Specification<Review> searchQueryByProductId(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.join(Review_.product).get(Product_.productId).as(String.class), "%" + searchQuery + "%");
    };
  }

  public static Specification<Review> createdDateAfter(LocalDateTime startDate) {
    return (root, query, builder) -> {
      if (startDate == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.greaterThanOrEqualTo(root.get(Review_.createdAt), startDate);
    };
  }

  public static Specification<Review> createdDateBefore(LocalDateTime endDate) {
    return (root, query, builder) -> {
      if (endDate == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.lessThanOrEqualTo(root.get(Review_.createdAt), endDate);
    };
  }

}
