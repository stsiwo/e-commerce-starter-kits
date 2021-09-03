package com.iwaodev.domain.service;

import java.util.List;

import com.iwaodev.exception.NotFoundException;
import com.iwaodev.exception.OutOfStockException;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.Product;

public interface ProductStockService {

  public List<Product> restore(List<OrderDetail> orderDetails) throws NotFoundException;

  public List<Product> take(List<OrderDetail> orderDetails) throws NotFoundException, OutOfStockException;
}
