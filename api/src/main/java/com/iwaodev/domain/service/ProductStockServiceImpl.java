package com.iwaodev.domain.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.exception.OutOfStockException;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.Product;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.iwaodev.exception.AppException;

@Service
public class ProductStockServiceImpl implements ProductStockService {

  private static final Logger logger = LoggerFactory.getLogger(ProductStockServiceImpl.class);

  /**
   * restore product stock since order did not succeed
   **/
  @Override
  public List<Product> restore(List<OrderDetail> orderDetails) throws NotFoundException {

    List<Product> products = new ArrayList<>();

    for (OrderDetail orderDetail : orderDetails) {

      Product product = orderDetail.getProduct();
      Long variantId = orderDetail.getProductVariant().getVariantId();

      product.increaseStockOfVariantBack(orderDetail.getProductQuantity(), variantId);

      products.add(product);
    }

    return products;
  }

  @Override
  public List<Product> take(List<OrderDetail> orderDetails) throws NotFoundException, OutOfStockException {

    // find target product and variant by criteria productId & variantId
    // TODO: make sure pessimistic lock works

    //Product product = this.productRepository.findByIdWithPessimisticLock(productId)
    //    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND,
    //        this.ExceptionMessenger.getNotFoundMessage("product", productId.toString())));

    // increase the stock back for each item
    List<Product> products = new ArrayList<>();

    for (OrderDetail orderDetail : orderDetails) {
      Product product = orderDetail.getProduct();
      Long variantId = orderDetail.getProductVariant().getVariantId();
      product.decreaseStockOfVariant(orderDetail.getProductQuantity(), variantId);
      products.add(product);
    }

    return products;
  }
}
