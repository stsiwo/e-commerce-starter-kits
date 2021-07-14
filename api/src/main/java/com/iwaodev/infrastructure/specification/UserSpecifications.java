package com.iwaodev.infrastructure.specification;

import java.time.LocalDateTime;

import com.iwaodev.domain.user.UserActiveEnum;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.model.UserType_;
import com.iwaodev.infrastructure.model.User_;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class UserSpecifications {

  public static Specification<User> isMemberSince(LocalDateTime signUpDate) {
    return (root, query, builder) -> {
      if (signUpDate == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use 'conjunction()' 
         **/
        return builder.conjunction();
      }
      return builder.greaterThanOrEqualTo(root.get(User_.createdAt), signUpDate);
    };
  }

  public static Specification<User> isMemberBefore(LocalDateTime signUpDate) {
    return (root, query, builder) -> {
      if (signUpDate == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use 'conjunction()' 
         **/
        return builder.conjunction();
      }
      return builder.lessThanOrEqualTo(root.get(User_.createdAt), signUpDate);
    };
  }

  public static Specification<User> isUserActiveType(UserActiveEnum active) {
    return (root, query, builder) -> {
      if (active == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use 'conjunction()' 
         **/
        return builder.conjunction();
      }
      return builder.equal(root.get(User_.active), active);
    };
  }

  public static Specification<User> searchQueryByLastName(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use 'conjunction()' 
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(User_.lastName), "%" + searchQuery + "%");
    };
  }

  public static Specification<User> searchQueryByFirstName(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use 'conjunction()' 
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(User_.firstName), "%" + searchQuery + "%");
    };
  }

  public static Specification<User> searchQueryByEmail(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use 'conjunction()' 
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(User_.email), "%" + searchQuery + "%");
    };
  }

  public static Specification<User> searchQueryByUserId(String searchQuery) {
    return (root, query, builder) -> {
      if (searchQuery == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use 'conjunction()' 
         **/
        return builder.conjunction();
      }
      return builder.like(root.get(User_.userId).as(String.class), "%" + searchQuery + "%");
    };
  }

  public static Specification<User> byUserType(UserTypeEnum userType) {
    return (root, query, builder) -> {
      if (userType == null) {
        /**
         * if paramter is null, we still want to chain specificiation so use 'conjunction()' 
         **/
        return builder.conjunction();
      }
      return builder.equal(root.join(User_.userType).get(UserType_.userType), userType);
    };
  }
}
