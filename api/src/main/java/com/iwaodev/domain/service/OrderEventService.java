package com.iwaodev.domain.service;

import java.util.UUID;

import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.User;

public interface OrderEventService {

  public void addByCustomer(Order order, OrderStatusEnum orderStatus, String note, User user) throws DomainException, NotFoundException;

  public void addByAdmin(Order order, OrderStatusEnum orderStatus, String note, User user) throws DomainException, NotFoundException;

  /**
   * use for DRAFT, ORDERED, SESSION_TIMEOUT, PAID, and PAYMENT_FAILED. these are added by program (not manually by admin/guest/member)
   * @param order
   * @param orderStatus
   * @param note
   * @param user
   * @throws DomainException
   * @throws NotFoundException
   */
  public void addByProgram(Order order, OrderStatusEnum orderStatus, String note, User user) throws DomainException, NotFoundException;
}

