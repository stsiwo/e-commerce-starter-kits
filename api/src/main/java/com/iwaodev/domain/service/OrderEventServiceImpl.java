package com.iwaodev.domain.service;

import java.util.UUID;

import javax.transaction.Transactional;

import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderEvent;
import com.iwaodev.infrastructure.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderEventServiceImpl implements OrderEventService {

  private static final Logger logger = LoggerFactory.getLogger(OrderEventServiceImpl.class);

  @Autowired
  private UserRepository userRepository;

  @Override
  public void add(Order order, OrderStatusEnum orderStatus, String note, UUID userId)
      throws DomainException, NotFoundException {

     if (userId == null) {
       // guest
       this.add(order, orderStatus, note, (User)null);
     }  else {
       // member
      User user = this.userRepository.findById(userId)
          .orElseThrow(() -> new NotFoundException(String.format("user not found (id: %s", userId.toString())));

       this.add(order, orderStatus, note, user);
     }
  }

  @Override
  public void add(Order order, OrderStatusEnum orderStatus, String note, User user)
      throws DomainException, NotFoundException {

    // check a given order status is addable as next.
  // if there is no previous order event, skip this validation
    if (order.retrieveLatestOrderEvent() != null && !order.isAddableAsNextForAdmin(orderStatus, order.retrieveLatestOrderEvent().getOrderStatus())) {
      throw new DomainException(
          String.format("the order status is not addable as next one (target status: %s and latest status: %s).",
              orderStatus, order.getLatestOrderEventStatus()));
    }

    OrderEvent orderEvent = order.createOrderEvent(orderStatus, note);

    if (user != null) {
      orderEvent.setUser(user);
      orderEvent.setIsGuest(false);
    } else {
      // guest
      orderEvent.setIsGuest(true);
    }

    order.addOrderEvent(orderEvent);
  }

}
