package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.infrastructure.model.OrderEvent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class OrderEventListener {

  // main ref: https://www.baeldung.com/jpa-entity-lifecycle-events

  private static final Logger logger = LoggerFactory.getLogger(OrderEventListener.class);

  @PrePersist
  private void beforeCreate(OrderEvent domain) {
  }

  @PreUpdate
  private void beforeUpdate(OrderEvent domain) {
  }

  /**
   * if PostLoad on entity doesnt work for you, you need to define this.
   *
   * ref: https://stackoverflow.com/questions/2802676/hibernate-postload-never-gets-invoked
   *
   * stop using this. so complicated.
   *
   *  - esp for removing. it is impossible to call to 'setUp...' method from deleted (e.g., orderEvent)  domain since the domain does have any parent.
   *
   *  => manually call in service layer.
   **/
  @PostPersist
  @PostUpdate
  @PostLoad
  @PostRemove
  private void afterLoad(OrderEvent domain) {
    //if (domain.getOrder() != null) {
    //  domain.getOrder().setUpCalculatedProperties();
    //}
  }
}



