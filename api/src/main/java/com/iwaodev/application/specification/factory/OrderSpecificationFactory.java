package com.iwaodev.application.specification.factory;

import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.ui.criteria.order.OrderQueryStringCriteria;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public interface OrderSpecificationFactory {

  public Specification<Order> build(OrderQueryStringCriteria criteria); 
}


