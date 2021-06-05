package com.iwaodev.infrastructure.specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.criteria.CriteriaQuery;

import com.iwaodev.infrastructure.model.WishlistItem;
import com.iwaodev.infrastructure.model.ProductVariant_;
import com.iwaodev.infrastructure.model.Product_;
import com.iwaodev.infrastructure.model.Review_;
import com.iwaodev.infrastructure.model.User_;
import com.iwaodev.infrastructure.model.WishlistItem_;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class WishlistItemSpecifications {

  private static final String Reviews_ = null;

  // advance usage eample:
  // https://stackoverflow.com/questions/21841201/sum-with-one-to-many-spring-data-jpa

  public static Specification<WishlistItem> isGreaterThanReviewPointOf(Double reviewPoint) {
    return (root, query, builder) -> {
      if (reviewPoint == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }

      return builder.greaterThanOrEqualTo(root.join(WishlistItem_.variant).join(ProductVariant_.product)
          .get(Product_.averageReviewPoint), reviewPoint);
    };
  }

  /**
   * #TODO: review this (root, query, builder) stuff to create complex sql
   **/
  public static Specification<WishlistItem> moreThanEqualWishlistItemPrice(BigDecimal minPrice) {
    return (root, query, builder) -> {
      if (minPrice == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }

      // cheapst price ---> min price ---> highest price => that product should be
      // included.

      return builder.greaterThanOrEqualTo(
          root.join(WishlistItem_.variant).join(ProductVariant_.product).get(Product_.highestPrice), minPrice);
    };
  }

  public static Specification<WishlistItem> lessThanEqualWishlistItemPrice(BigDecimal maxPrice) {
    return (root, query, builder) -> {
      if (maxPrice == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      // cheapest price --> max price ---> highest price => that product should be
      // included.
      return builder.greaterThanOrEqualTo(
          root.join(WishlistItem_.variant).join(ProductVariant_.product).get(Product_.cheapestPrice), maxPrice);
    };
  }

  public static Specification<WishlistItem> isWishlistItemDiscount(Boolean isDiscount) {
    return (root, query, builder) -> {
      if (isDiscount == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.equal(
          root.join(WishlistItem_.variant).join(ProductVariant_.product).get(Product_.isDiscountAvailable), isDiscount);

    };
  }

  public static Specification<WishlistItem> searchQueryByWishlistItemName(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.join(WishlistItem_.variant).join(ProductVariant_.product).get(Product_.productName),
          "%" + searchQuery + "%");
    };
  }

  public static Specification<WishlistItem> searchQueryByWishlistItemDescription(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(
          root.join(WishlistItem_.variant).join(ProductVariant_.product).get(Product_.productDescription),
          "%" + searchQuery + "%");
    };
  }

  public static Specification<WishlistItem> releaseDateAfter(LocalDateTime startDate) {
    return (root, query, builder) -> {
      if (startDate == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.greaterThanOrEqualTo(
          root.join(WishlistItem_.variant).join(ProductVariant_.product).get(Product_.releaseDate), startDate);
    };
  }

  public static Specification<WishlistItem> releaseDateBefore(LocalDateTime endDate) {
    return (root, query, builder) -> {
      if (endDate == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.lessThanOrEqualTo(
          root.join(WishlistItem_.variant).join(ProductVariant_.product).get(Product_.releaseDate), endDate);
    };
  }

  public static Specification<WishlistItem> isBlongToUserOf(UUID userId) {
    return (root, query, builder) -> {
      if (userId == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.equal(root.join(WishlistItem_.user).get(User_.userId), userId);
    };
  }
}
