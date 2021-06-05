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
  public void add(Order order, OrderStatusEnum orderStatus, String note, UUID userId) throws DomainException, NotFoundException {

    // check a given order status is addable as next.
    if (!order.isAddableAsNextForAdmin(orderStatus, order.getLatestOrderEventStatus())) {
      throw new DomainException(String.format("the order status is not addable as next one (target status: %s and latest status: %s).", orderStatus, order.getLatestOrderEventStatus()));
    }

    OrderEvent orderEvent = order.createOrderEvent(orderStatus, note);

    // admin
    if (userId != null) {
      // the customer
      User user = this.userRepository.findById(userId)
          .orElseThrow(() -> new NotFoundException(String.format("user not found (id: %s", userId.toString())));

      orderEvent.setUser(user);
    }

    order.addOrderEvent(orderEvent);
  }

}
