package com.iwaodev.infrastructure.specification;

import java.time.LocalDateTime;

import com.iwaodev.infrastructure.model.User;
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
}
