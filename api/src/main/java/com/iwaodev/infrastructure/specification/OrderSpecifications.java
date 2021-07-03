package com.iwaodev.infrastructure.specification;

import java.time.LocalDateTime;
import java.util.UUID;

import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderEvent_;
import com.iwaodev.infrastructure.model.Order_;
import com.iwaodev.infrastructure.model.User_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class OrderSpecifications {

  private static final Logger logger = LoggerFactory.getLogger(OrderSpecifications.class);

  /**
   * search keyword: criteria builder 
   **/

  public static Specification<Order> orderStatusOf(OrderStatusEnum status) {
    return (root, query, builder) -> {
      if (status == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      logger.info("lastest order event status: " + Order_.latestOrderEventStatus);
      logger.info("query status: " + status);
      return builder.equal(root.get(Order_.latestOrderEventStatus), status);
    };
  }

  // this is only used for member when they access orders page
  public static Specification<Order> byUserId(UUID userId) {
    return (root, query, builder) -> {
      if (userId == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.equal(root.join(Order_.user).get(User_.userId), userId);
    };
  }

  public static Specification<Order> searchQueryByOrderNumber(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(Order_.orderNumber), "%" + searchQuery + "%");
    };
  }

  public static Specification<Order> searchQueryByOrderId(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(Order_.orderId).as(String.class), "%" + searchQuery + "%");
    };
  }

  // this is only used for email link 
  public static Specification<Order> searchByOrderId(UUID orderId) {
    return (root, query, builder) -> {
      if (orderId == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.equal(root.get(Order_.orderId), orderId);
    };
  }

  public static Specification<Order> searchQueryByOrderFirstName(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(Order_.orderFirstName), "%" + searchQuery + "%");
    };
  }

  public static Specification<Order> searchQueryByOrderLastName(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(Order_.orderLastName), "%" + searchQuery + "%");
    };
  }

  public static Specification<Order> searchQueryByOrderEmail(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(Order_.orderEmail), "%" + searchQuery + "%");
    };
  }

  public static Specification<Order> createdDateAfter(LocalDateTime startDate) {
    return (root, query, builder) -> {
      if (startDate == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.greaterThanOrEqualTo(root.get(Order_.createdAt), startDate);
    };
  }

  public static Specification<Order> createdDateBefore(LocalDateTime endDate) {
    return (root, query, builder) -> {
      if (endDate == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use
         * 'conjunction()'
         **/
        return builder.conjunction();
      }
      return builder.lessThanOrEqualTo(root.get(Order_.createdAt), endDate);
    };
  }

}
