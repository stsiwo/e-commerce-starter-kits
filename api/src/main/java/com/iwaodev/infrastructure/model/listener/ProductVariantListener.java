package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.infrastructure.model.ProductVariant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ProductVariantListener {

  // main ref: https://www.baeldung.com/jpa-entity-lifecycle-events

  private static final Logger logger = LoggerFactory.getLogger(ProductVariantListener.class);

  @PrePersist
  private void beforeCreate(ProductVariant domain) {
  }

  @PreUpdate
  private void beforeUpdate(ProductVariant domain) {
  }

  /**
   * if PostLoad on entity doesnt work for you, you need to define this.
   *
   * ref: https://stackoverflow.com/questions/2802676/hibernate-postload-never-gets-invoked
   **/
  @PostPersist
  @PostUpdate
  @PostLoad
  @PostRemove
  private void afterLoad(ProductVariant domain) {
    domain.getCurrentPrice();
  }

}


