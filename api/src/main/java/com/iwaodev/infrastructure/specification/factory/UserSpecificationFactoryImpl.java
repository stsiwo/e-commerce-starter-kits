package com.iwaodev.infrastructure.specification.factory;

import com.iwaodev.application.specification.factory.UserSpecificationFactory;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.specification.UserSpecifications;
import com.iwaodev.ui.criteria.user.UserQueryStringCriteria;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class UserSpecificationFactoryImpl implements UserSpecificationFactory {

  private UserSpecifications specifications;

  @Autowired
  public UserSpecificationFactoryImpl(UserSpecifications specifications) {
    this.specifications = specifications;
  }

	@Override
	public Specification<User> build(UserQueryStringCriteria criteria) {
    return this.specifications.isMemberSince(criteria.getStartDate())
      .and(this.specifications.isMemberBefore(criteria.getEndDate()))
      .and(this.specifications.isUserActiveType(criteria.getActive()))
      .and(
          this.specifications.searchQueryByFirstName(criteria.getSearchQuery())
            .or(this.specifications.searchQueryByLastName(criteria.getSearchQuery()))
            .or(this.specifications.searchQueryByEmail(criteria.getSearchQuery()))
            .or(this.specifications.searchQueryByUserId(criteria.getSearchQuery()))
          );
	}
}
