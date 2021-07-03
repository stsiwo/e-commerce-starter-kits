package com.iwaodev.infrastructure.specification;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.ListJoin;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import com.iwaodev.infrastructure.model.Category_;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductVariant;
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

      /**
       * get cheapest price.
       **/

      logger.info("where is my bug.");

      /**
       * base query: 
       *  select min(cheapest_price) 
       *  from (
       *    select 
       *      p.product_id as id, 
       *      case pv.is_discount 
       *        when 1 then pv.variant_discount_price 
       *        else least(p.product_base_unit_price, ifnull(pv.variant_unit_price, 2147483647))
       *      end as cheapest_price 
       *    from products p 
       *    left join product_variants pv on pv.product_id = p.product_id
       *  ) as cheapest 
       *  where id = <product_id>;
       **/

      //Subquery<BigDecimal> subQuery = query.subquery(BigDecimal.class);
      //Root<Product> subRoot = subQuery.from(Product.class);
      //Join<Product, ProductVariant> variant = subRoot.join(Product_.variants, JoinType.INNER);

      //Expression<BigDecimal> cheapestPrice = builder.selectCase()
      //    .when(builder.isTrue(variant.get(ProductVariant_.isDiscount)), variant.get(ProductVariant_.variantDiscountPrice))
      //    .otherwise(builder.selectCase()
      //        .when(builder.isNull(variant.get(ProductVariant_.variantUnitPrice)), subRoot.get(Product_.productBaseUnitPrice))
      //        .otherwise(variant.get(ProductVariant_.variantUnitPrice)).as(BigDecimal.class))
      //    .as(BigDecimal.class);

      //query.multiselect(
      //   builder.min(cheapestPrice) 
      //    );

      

      //Expression<BigDecimal> cheapestPrice = builder.selectCase()
      //    .when(builder.isTrue(root.join(Product_.variants).get(ProductVariant_.isDiscount)),
      //        root.join(Product_.variants).get(ProductVariant_.variantDiscountPrice))
      //    .otherwise(builder.selectCase()
      //        .when(builder.isNull(root.join(Product_.variants).get(ProductVariant_.variantUnitPrice)),
      //            root.get(Product_.productBaseUnitPrice))
      //        .otherwise(root.join(Product_.variants).get(ProductVariant_.variantUnitPrice)).as(BigDecimal.class))
      //    .as(BigDecimal.class);
     
      /**
       * @2021/07/01
       * just realize taht you don't need to write this complicated sql if you can persist 'cheapestPrice' in database.
       **/

      return builder.lessThanOrEqualTo(root.get(Product_.cheapestPrice), maxPrice);
    };
  }

  public static Specification<Product> isAnyVariantOfThisProductDiscount(Boolean isDiscount) {
    return (root, query, builder) -> {

      if (isDiscount != null && isDiscount) {
        /**
         * wierd bugs:
         *
         * compiling error: no equivalent method. you need to Expression<...> but you
         * have Path<...> => solution: you need to use 'as(...)' function like below. -
         * ref:
         * https://stackoverflow.com/questions/24210887/jpa-criteria-convert-int-to-string-then-select-from-substring-of-resulting-stri
         *
         **/

        /**
         * you don't need to use subquery at all since you can just refer to 'root' and
         * its association from main query not from subquery.
         *
         **/
        // Subquery<Product> subQuery = query.subquery(Product.class);
        // Root<Product> subRoot = subQuery.from(Product.class);
        // Join<Product, ProductVariant> variant = subRoot.join(Product_.variants,
        // JoinType.INNER);
        // subQuery.select(subRoot)
        // .where(builder.and(builder.equal(variant.get(ProductVariant_.isDiscount),
        // true),
        // builder.between(builder.currentTimestamp(),
        // variant.get(ProductVariant_.variantDiscountStartDate).as(Timestamp.class),
        // variant.get(ProductVariant_.variantDiscountEndDate).as(Timestamp.class))));

        /**
         * follow the considiton for discount.
         **/

        return builder.and(
            builder.equal(root.join(Product_.variants, JoinType.INNER).get(ProductVariant_.isDiscount), true),
            builder.between(builder.currentTimestamp(),
                root.join(Product_.variants, JoinType.INNER).get(ProductVariant_.variantDiscountStartDate)
                    .as(Timestamp.class),
                root.join(Product_.variants, JoinType.INNER).get(ProductVariant_.variantDiscountEndDate)
                    .as(Timestamp.class)));
      } else {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
    };
  }

  private static Timestamp localToTimeStamp(LocalDateTime date) {
    return Timestamp.from(date.toInstant(ZoneOffset.UTC));
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
   * child entity filtering does not work. don't do this. use @Filter/@FilterDef
   * instead.
   **/
  // public static Specification<Product> isVerifiedReviewsOfThisProduct(Boolean
  // isVerifiedReviews) {
  // return (root, query, builder) -> {
  // if (isVerifiedReviews == null) {
  // /**
  // * if paramter is null, we still want to chain specificiation so use
  // * 'conjunction()'
  // **/
  // return builder.conjunction();
  // }
  // logger.info("is this called?");
  // logger.info("" + isVerifiedReviews);
  // return builder.equal(root.join(Product_.reviews).get(Review_.isVerified),
  // isVerifiedReviews);
  // };
  // }

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
