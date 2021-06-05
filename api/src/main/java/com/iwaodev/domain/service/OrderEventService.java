package com.iwaodev.domain.service;

import java.util.UUID;

import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Order;

public interface OrderEventService {

  public void add(Order order, OrderStatusEnum orderStatus, String note, UUID userId) throws DomainException, NotFoundException;
}

