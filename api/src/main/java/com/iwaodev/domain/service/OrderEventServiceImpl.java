package com.iwaodev.domain.service;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.transaction.Transactional;

import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.domain.order.OrderRule;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.exception.AppException;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderEvent;
import com.iwaodev.infrastructure.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class OrderEventServiceImpl implements OrderEventService {

  private static final Logger logger = LoggerFactory.getLogger(OrderEventServiceImpl.class);

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private OrderRule orderRule;

  private void add(Order order, OrderStatusEnum orderStatus, String note, UUID userId)
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

  private void add(Order order, OrderStatusEnum orderStatus, String note, User user)
      throws DomainException, NotFoundException {

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

  /**
   * call when the customer (MEMBER/ANONYMOUS) try to add an order event.
   *
   * conditions:
   *  - eligible to refund (not passed 30 days after delivery)
   *  - addable by member/anonymous (see OrderEventBag.java for more detail)
   *
   * @param order
   * @param orderStatus
   * @param note
   * @param user
   * @throws DomainException
   * @throws NotFoundException
   */
  @Override
  public void addByCustomer(Order order, OrderStatusEnum orderStatus, String note, User user) throws DomainException, NotFoundException {

    // if return request, check the eligibility to refund
    // this only apply for members so if admin want to add either
    // 'return_request'/'cancel_request', he can do so by using 'careateOrderEvent'
    // service function above.
    if (orderStatus.equals(OrderStatusEnum.RETURN_REQUEST)) {
      LocalDateTime curDateTime = LocalDateTime.now();
      if (!order.isEligibleToRefund(curDateTime, this.orderRule.getEligibleDays())) {
        logger.debug("sorry. this order is not eligible to return.");
        throw new DomainException("sorry. this order is not eligible to return.");
      }
    }

    // addable by member/anonymous (see OrderEventBag.java for more detail)
    // check a given order status is addable as next.
    // if there is no previous order event, skip this validation
    if (order.retrieveLatestOrderEvent() != null && !order.isAddableAsNextForMember(orderStatus, order.retrieveLatestOrderEvent().getOrderStatus())) {
      throw new DomainException(
              String.format("the order status is not addable as next one (target status: %s and latest status: %s).",
                      orderStatus, order.getLatestOrderEventStatus()));
    }

    this.add(order, orderStatus, note, user);
  }

  /**
   * call when the admin (ADMIN) try to add an order event.
   *
   * conditions:
   *  - addable by admin (see OrderEventBag.java for more detail)
   *
   * @param order
   * @param orderStatus
   * @param note
   * @param user
   * @throws DomainException
   * @throws NotFoundException
   */
  @Override
  public void addByAdmin(Order order, OrderStatusEnum orderStatus, String note, User user) throws DomainException, NotFoundException {

    // addable by member/anonymous (see OrderEventBag.java for more detail)
    // check a given order status is addable as next.
    // if there is no previous order event, skip this validation
    if (order.retrieveLatestOrderEvent() != null && !order.isAddableAsNextForAdmin(orderStatus, order.retrieveLatestOrderEvent().getOrderStatus())) {
      throw new DomainException(
              String.format("the order status is not addable as next one (target status: %s and latest status: %s).",
                      orderStatus, order.getLatestOrderEventStatus()));
    }

    this.add(order, orderStatus, note, user);
  }

  @Override
  public void addByProgram(Order order, OrderStatusEnum orderStatus, String note, User user) throws DomainException, NotFoundException {

    /**
     * add without any validation
     */
    this.add(order, orderStatus, note, user);
  }
}
