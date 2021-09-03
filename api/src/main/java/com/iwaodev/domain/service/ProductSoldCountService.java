package com.iwaodev.domain.service;

import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.Product;

import java.util.List;

public interface ProductSoldCountService {

  public List<Product> add(List<OrderDetail> orderDetails) throws NotFoundException;

  public List<Product> getBack(List<OrderDetail> orderDetails) throws NotFoundException;
}
