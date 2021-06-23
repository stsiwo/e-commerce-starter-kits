package com.iwaodev.infrastructure.model.listener;

import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.iwaodev.infrastructure.model.Order;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class OrderListener {

  // main ref: https://www.baeldung.com/jpa-entity-lifecycle-events

  private static final Logger logger = LoggerFactory.getLogger(OrderListener.class);

  @PrePersist
  private void beforeCreate(Order domain) {
  }

  @PreUpdate
  private void beforeUpdate(Order domain) {
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
  private void afterLoad(Order domain) {
    //domain.setUpCalculatedProperties();
  }
}



