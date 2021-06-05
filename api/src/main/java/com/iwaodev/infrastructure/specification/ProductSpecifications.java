package com.iwaodev.infrastructure.specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.iwaodev.infrastructure.model.Category_;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductVariant_;
import com.iwaodev.infrastructure.model.Product_;
import com.iwaodev.infrastructure.model.Review_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class ProductSpecifications {

  private static final Logger logger = LoggerFactory.getLogger(ProductSpecifications.class);

  public static Specification<Product> isBlongToCategoryOf(Long categoryId) {
    return (root, query, builder) -> {
      if (categoryId == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      /**
       * nested entity's property - you need to use like below. - ref:
       * https://stackoverflow.com/questions/60939072/hibernate-jpa-meta-model-reference-nested-properties
       **/
      return builder.equal(root.join(Product_.category).get(Category_.categoryId), categoryId);
    };
  }

  public static Specification<Product> isGreaterThanReviewPointOf(Double reviewPoint) {
    return (root, query, builder) -> {
      if (reviewPoint == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.greaterThanOrEqualTo(root.get(Product_.averageReviewPoint), reviewPoint);
    };
  }

  /**
   * #TODO: review this (root, query, builder) stuff to create complex sql
   **/
  public static Specification<Product> moreThanEqualProductPrice(BigDecimal minPrice) {
    return (root, query, builder) -> {
      if (minPrice == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.greaterThanOrEqualTo(root.get(Product_.highestPrice), minPrice);
    };
  }

  public static Specification<Product> lessThanEqualProductPrice(BigDecimal maxPrice) {
    return (root, query, builder) -> {
      if (maxPrice == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.greaterThanOrEqualTo(root.get(Product_.cheapestPrice), maxPrice);
    };
  }

  public static Specification<Product> isAnyVariantOfThisProductDiscount(Boolean isDiscount) {
    return (root, query, builder) -> {
      if (isDiscount == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.equal(root.join(Product_.variants).get(ProductVariant_.isDiscount), isDiscount);

    };
  }

  public static Specification<Product> isDiscountOfThisProduct(Boolean isDiscount) {
    return (root, query, builder) -> {
      if (isDiscount == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.equal(root.get(Product_.isDiscount), isDiscount);
    };
  }

  public static Specification<Product> isPublicOfThisProduct(Boolean isPublic) {
    return (root, query, builder) -> {
      if (isPublic == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.equal(root.get(Product_.isPublic), isPublic);
    };
  }

  /**
   * child entity filtering does not work. don't do this. use @Filter/@FilterDef instead.
   **/
  //public static Specification<Product> isVerifiedReviewsOfThisProduct(Boolean isVerifiedReviews) {
  //  return (root, query, builder) -> {
  //    if (isVerifiedReviews == null) {
  //      /**
  //       * if paramter is null, we still want to chain specificiation so use
  //       * 'conjunction()'
  //       **/
  //      return builder.conjunction();
  //    }
  //    logger.info("is this called?");
  //    logger.info("" + isVerifiedReviews);
  //    return builder.equal(root.join(Product_.reviews).get(Review_.isVerified), isVerifiedReviews);
  //  };
  //}

  public static Specification<Product> searchQueryByProductName(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(Product_.productName), "%" + searchQuery + "%");
    };
  }

  public static Specification<Product> searchQueryByProductDescription(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(Product_.productDescription), "%" + searchQuery + "%");
    };
  }

  public static Specification<Product> releaseDateAfter(LocalDateTime startDate) {
    return (root, query, builder) -> {
      if (startDate == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.greaterThanOrEqualTo(root.get(Product_.releaseDate), startDate);
    };
  }

  public static Specification<Product> releaseDateBefore(LocalDateTime endDate) {
    return (root, query, builder) -> {
      if (endDate == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.lessThanOrEqualTo(root.get(Product_.releaseDate), endDate);
    };
  }

}
