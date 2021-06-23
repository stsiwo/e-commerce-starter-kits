package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductVariant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ProductListener {

  // main ref: https://www.baeldung.com/jpa-entity-lifecycle-events

  private static final Logger logger = LoggerFactory.getLogger(ProductListener.class);

  @PrePersist
  private void beforeCreate(Product domain) {
  }

  @PreUpdate
  private void beforeUpdate(Product domain) {
  }

  /**
   * if PostLoad on entity doesnt work for you, you need to define this.
   *
   * ref:
   * https://stackoverflow.com/questions/2802676/hibernate-postload-never-gets-invoked
   *
   * in this use case, you can use this reather than Order & OrderEvent case.
   *
   * if children properties does not affect outside such as parent proerpties, you can use this eventlistener.
   *
   **/
  @PostPersist
  @PostUpdate
  @PostLoad
  @PostRemove
  private void afterLoad(Product domain) {
    if (domain.getVariants() != null) {
      for (ProductVariant variant : domain.getVariants()) {
        variant.getCurrentPrice();
      }
    }
  }

}
