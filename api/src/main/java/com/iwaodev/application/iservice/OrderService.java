package com.iwaodev.application.iservice;

import java.util.UUID;

import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.order.OrderEventDTO;
import com.iwaodev.domain.order.OrderSortEnum;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.ui.criteria.order.OrderCriteria;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;
import com.iwaodev.ui.criteria.order.OrderQueryStringCriteria;
import com.iwaodev.ui.response.PaymentIntentResponse;

import org.springframework.data.domain.Page;

public interface OrderService {

  /**
   * get all orders
   **/
  public Page<OrderDTO> getAll(OrderQueryStringCriteria criteria, Integer page, Integer limit, OrderSortEnum sort);

  /**
   * get all order of a given user
   **/
  public Page<OrderDTO> getAllByUserId(UUID userId, OrderQueryStringCriteria criteria, Integer page, Integer limit, OrderSortEnum sort);

  /**
   * get an order of a given user
   **/
  public OrderDTO getByIdAndUserId(UUID orderId, UUID userId);

  /**
   * get a single order
   **/
  public OrderDTO getById(UUID orderId);

  /**
   * create an order for member usres and return 'client_secret' (Stripe)
   **/
  public PaymentIntentResponse createForMember(OrderCriteria criteria, UUID authUserId);

  /**
   * create an order for guest usres and return 'client_secret' (Stripe)
   **/
  public PaymentIntentResponse createForGuest(OrderCriteria criteria);

  /**
   * add an order event to existing order (e.g., session-time, cancel, returned, completed, and so on)
   **/
  public OrderDTO addSessionTimeoutOrderEvent(UUID orderId, String orderNumber, UUID userId);

  /**
   * add an order event to existing order (e.g., session-time, cancel, returned, completed, and so on)
   **/
  public OrderDTO addOrderEvent(UUID orderId, OrderEventCriteria criteria);

  /**
   * add an order event to existing order by member ('request_return' and 'request_cancel')
   **/
  public OrderDTO addOrderEventByMember(UUID orderId, OrderEventCriteria criteria);

  /**
   * update an existing order event 
   **/
  public OrderEventDTO updateOrderEvent(UUID orderId, Long orderEventId, OrderEventCriteria criteria);

  /**
   * delete an existing order event 
   **/
  public OrderDTO deleteOrderEvent(UUID orderId, Long orderEventId);

  /**
   * handle refund for a specific order after shipment already made.
   **/
  public void refundOrderAfterShipment(UUID orderId);

  /**
   * handle refund for a specific order before shipment.
   **/
  public void refundBeforeShipment(UUID orderId);

  /**
   * assign order details of a given order.
   *
   * - OrderMapper ignore the mapping OrderDetailCriteria to OrderCriteria since it requires repository, and this is a reason why I put this on application service, not inside domain service.
   **/
  public void assignOrderDetails(OrderCriteria criteria, Order order);
  

  public void testEvent();

}



