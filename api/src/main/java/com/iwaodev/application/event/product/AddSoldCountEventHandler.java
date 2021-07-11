package com.iwaodev.application.event.product;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.domain.order.event.CompletedOrderPaymentEvent;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.Product;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class AddSoldCountEventHandler implements EventHandler<CompletedOrderPaymentEvent>{

  private static final Logger logger = LoggerFactory.getLogger(AddSoldCountEventHandler.class);

  private ProductRepository productRepository;

  @Autowired
  public AddSoldCountEventHandler(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleEvent(CompletedOrderPaymentEvent event) throws AppException {

    logger.info("start handleAddSoldCountEventHandler");
    logger.info(Thread.currentThread().getName());

    Order order = event.getOrder();

    /**
     * increase the sold number for each ordered item after payment succeeded.
     *
     **/
    List<Product> products = new ArrayList<>();

    for (OrderDetail orderDetail : order.getOrderDetails()) {

      UUID productId = orderDetail.getProduct().getProductId();
      Long variantId = orderDetail.getProductVariant().getVariantId();

      Optional<Product> productOption = this.productRepository.findById(productId);

      if (productOption.isEmpty()) {
        // product not found so return error
        logger.info("the given product does not exist (productId: " + productId.toString());
        throw new AppException(HttpStatus.NOT_FOUND, "the given customer does not exist.");
      }
      // product found so assign it to this order
      Product product = productOption.get();

      product.addSoldCountForVariant(orderDetail.getProductQuantity(), variantId);

      products.add(product);
    }

    this.productRepository.saveAll(products);
  }
}
