package com.iwaodev.application.irepository;

import com.iwaodev.infrastructure.model.Order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface AdvanceOrderRepository {

  public Page<Order> findAllToAvoidNPlusOne(Specification<Order> spec, Pageable pageable);
}
