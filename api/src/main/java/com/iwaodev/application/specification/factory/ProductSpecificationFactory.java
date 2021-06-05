package com.iwaodev.application.specification.factory;

import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.ui.criteria.ProductQueryStringCriteria;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public interface ProductSpecificationFactory {

  public Specification<Product> build(ProductQueryStringCriteria criteria); 
}


