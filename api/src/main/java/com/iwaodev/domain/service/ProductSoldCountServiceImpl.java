package com.iwaodev.domain.service;

import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.exception.AppException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductSoldCountServiceImpl implements ProductSoldCountService {

  private static final Logger logger = LoggerFactory.getLogger(ProductSoldCountServiceImpl.class);

  @Autowired
  private ProductRepository productRepository;

  @Override
  public List<Product> add(List<OrderDetail> orderDetails) throws NotFoundException {

    List<Product> products = new ArrayList<>();

    for (OrderDetail orderDetail : orderDetails) {

      UUID productId = orderDetail.getProduct().getProductId();
      Long variantId = orderDetail.getProductVariant().getVariantId();

      Optional<Product> productOption = this.productRepository.findById(productId);

      if (!productOption.isPresent()) {
        // product not found so return error
        logger.debug("the given product does not exist (productId: " + productId.toString());
        throw new NotFoundException("the given product does not exist (productId: " + productId.toString());
      }
      // product found so assign it to this order
      Product product = productOption.get();

      product.addSoldCountForVariant(orderDetail.getProductQuantity(), variantId);

      products.add(product);
    }

    return products;
  }

  @Override
  public List<Product> getBack(List<OrderDetail> orderDetails) throws NotFoundException {

    List<Product> products = new ArrayList<>();

    for (OrderDetail orderDetail : orderDetails) {

      UUID productId = orderDetail.getProduct().getProductId();
      Long variantId = orderDetail.getProductVariant().getVariantId();

      Optional<Product> productOption = this.productRepository.findById(productId);

      /**
       * if target product exists, it get the sold count back (e.g., decrease), otherwise ignore it since when refund, the product might not exist (rarely though)
       */
      if (productOption.isPresent()) {
        // product found so assign it to this order
        Product product = productOption.get();

        product.decreaseSoldCountForVariant(orderDetail.getProductQuantity(), variantId);

        products.add(product);
      } else {
        logger.debug("the given product does not exist (productId: " + productId.toString());
      }
    }

    return products;
  }
}
