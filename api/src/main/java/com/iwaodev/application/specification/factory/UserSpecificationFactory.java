package com.iwaodev.application.specification.factory;

import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.UserQueryStringCriteria;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public interface UserSpecificationFactory {

  public Specification<User> build(UserQueryStringCriteria criteria); 
}

