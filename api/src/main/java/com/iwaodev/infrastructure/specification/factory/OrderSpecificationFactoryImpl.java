package com.iwaodev.infrastructure.specification.factory;

import com.iwaodev.application.specification.factory.OrderSpecificationFactory;
import com.iwaodev.application.specification.factory.ProductSpecificationFactory;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.specification.OrderSpecifications;
import com.iwaodev.infrastructure.specification.ProductSpecifications;
import com.iwaodev.ui.criteria.ProductQueryStringCriteria;
import com.iwaodev.ui.criteria.order.OrderQueryStringCriteria;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class OrderSpecificationFactoryImpl implements OrderSpecificationFactory {

  private OrderSpecifications specifications;

  @Autowired
  public OrderSpecificationFactoryImpl(OrderSpecifications specifications) {
    this.specifications = specifications;
  }

	@Override
	public Specification<Order> build(OrderQueryStringCriteria criteria) {
    return this.specifications.orderStatusOf(criteria.getOrderStatus())
      .and(this.specifications.createdDateAfter(criteria.getStartDate()))
      .and(this.specifications.createdDateBefore(criteria.getEndDate()))
      .and(this.specifications.byUserId(criteria.getUserId()))
      .and(
          this.specifications.searchQueryByOrderEmail(criteria.getSearchQuery())
            .or(this.specifications.searchQueryByOrderNumber(criteria.getSearchQuery()))
            .or(this.specifications.searchQueryByOrderLastName(criteria.getSearchQuery()))
            .or(this.specifications.searchQueryByOrderFirstName(criteria.getSearchQuery()))
          );
	}
}

