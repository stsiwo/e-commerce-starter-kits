package com.iwaodev.ui.controller;

import java.util.UUID;

import javax.validation.Valid;

import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.order.OrderEventDTO;
import com.iwaodev.application.iservice.OrderService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.domain.order.OrderSortEnum;
import com.iwaodev.ui.criteria.order.OrderCriteria;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;
import com.iwaodev.ui.criteria.order.OrderQueryStringCriteria;
import com.iwaodev.ui.criteria.order.SessionTimeoutOrderEventCriteria;
import com.iwaodev.ui.response.BaseResponse;
import com.iwaodev.ui.response.PaymentIntentResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderController {

  private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

  @Autowired
  private OrderService service;

  /**
   * get all orders (for admin)
   **/
  @GetMapping("/orders")
  @PreAuthorize("hasRole('ROLE_ADMIN')") 
  public ResponseEntity<Page<OrderDTO>> get(
      @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
      @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
      @RequestParam(value = "sort", required = false, defaultValue = "DATE_DESC") OrderSortEnum sort,
      OrderQueryStringCriteria criteria,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

	  return new ResponseEntity<>(
        this.service.getAll(criteria, page, limit, sort),
        HttpStatus.OK
        );
  }

  /**
   * get a single order
   **/
  @GetMapping("/orders/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN')") 
  public ResponseEntity<OrderDTO> getWithId(@PathVariable(value = "id") UUID id) throws Exception {
    return new ResponseEntity<>(this.service.getById(id), HttpStatus.OK);
  }

  /**
   * create a new order 
   *
   *  - return client Secret (Stripe)
   **/
  @PostMapping("/orders")
  public ResponseEntity<PaymentIntentResponse> post(
      @Valid @RequestBody OrderCriteria criteria, 
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

    PaymentIntentResponse response;

    if (authUser != null) {
      // make sure criteria and authUser has the same id
      criteria.setUserId(authUser.getId());

      // member
       response = this.service.createForMember(criteria, authUser.getId());
    } else {
      // guest
      response  = this.service.createForGuest(criteria);
    }

	  return new ResponseEntity<>(
        response, 
        HttpStatus.OK
        );
  }

  /**
   * add an order event (SESSION_TIMEOUT).
   *
   * - only session time since anyone can access. 
   *
   * - TODO: make sure security.
   *
   *   - add criteria to make sure orderNumber matches.
   *
   **/
  @PostMapping("/orders/{orderId}/events/session-timeout")
  public ResponseEntity<OrderDTO> orderEventSessionTimeout(
      @PathVariable(value = "orderId") UUID orderId,
      @Valid @RequestBody SessionTimeoutOrderEventCriteria criteria, 
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

    OrderDTO orderDTO;

    if (authUser != null) {
      orderDTO = this.service.addSessionTimeoutOrderEvent(orderId, criteria.getOrderNumber(), authUser.getId());
    } else {
      orderDTO = this.service.addSessionTimeoutOrderEvent(orderId, criteria.getOrderNumber(), null);
    }

	  return new ResponseEntity<>(
        orderDTO, 
        HttpStatus.OK
        );
  }

  /**
   * add an order event (any event).
   *
   * return the whole order dto. since adding an order event affect the other properties of the order.
   *
   **/
  @PostMapping("/orders/{orderId}/events")
  @PreAuthorize("hasRole('ROLE_ADMIN')") 
  public ResponseEntity<OrderDTO> addOrderEvent(
      @PathVariable(value = "orderId") UUID orderId,
      @Valid @RequestBody OrderEventCriteria criteria, 
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

    // make sure criteria and authUser has the same id
    criteria.setUserId(authUser.getId());

	  return new ResponseEntity<>(
        this.service.addOrderEventByAdmin(orderId, criteria),
        HttpStatus.OK
        );
  }

  /**
   * update an existing order event (any event)
   *
   *  - only allow to update 'note'
   *
   **/
  @PutMapping("/orders/{orderId}/events/{orderEventId}")
  @PreAuthorize("hasRole('ROLE_ADMIN')") 
  public ResponseEntity<OrderEventDTO> updateOrderEvent(
      @PathVariable(value = "orderId") UUID orderId,
      @PathVariable(value = "orderEventId") Long orderEventId,
      @Valid @RequestBody OrderEventCriteria criteria, 
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

      // make sure criteria and authUser has the same id
      criteria.setUserId(authUser.getId());

	  return new ResponseEntity<>(
        this.service.updateOrderEvent(orderId, orderEventId, criteria),
        HttpStatus.OK
        );
  }
  /**
   * delete an order event (condition apply)
   *
   *  - admin only
   *  - if the order event status is either:
   *  
   *    SHIPPED, // undoable
   *    DELIVERED, // undoable
   *    RECEIVED_RETURN_REQUEST, // return => refund after shipment && undoable
   *    RETURNED,  // undoable
   *    RECEIVED_CANCEL_REQUEST, // cancel => refund before shipment && undoable
   *    CANCELED, // undoable
   *    ERROR, // undoable
   *
   *  - return the whole order dto. this is because deleting an order event affects the other properties of the order.
   *
   **/
  @DeleteMapping("/orders/{orderId}/events/{orderEventId}")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  public ResponseEntity<OrderDTO> deleteOrderEvent(
      @PathVariable(value = "orderId") UUID orderId,
      @PathVariable(value = "orderEventId") Long orderEventId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

	  return new ResponseEntity<>(
        this.service.deleteOrderEvent(orderId, orderEventId),
        HttpStatus.OK
        );
  }

  /**
   * refund request to the order after shipment made.
   *
   * Called by only admin. once the admin make sure the request from the customer, he can send a request to this endpoint.
   *
   * Firstly, the customer send a request for return (e.g., adding an order event of 'Return_REQUEST'). then the admin confirm the request and click the refund button (only visible if order status is received_return_request) for the return. once the admin is ready to return, he can send a request to this endpoint. 
   *
   * Add 'RETURNED' order event internally.
   *
   * So, Call this after "RECEIVED_RETURN_REQUEST" event.
   *
   * @2021/07/09: change
   *
   *  - to make this process easy, decided to call 'refundBeforeShipment' internally inside event handler.
   *  
   *  - flow:
   *    1. the admin add order event (RETURNED). make sure to display a prompt that this is undoable since payment is canceled.
   *    2. publish an event (OrderEventWasAddedEvent@OrderService#addOrderEvent)
   *    3. the event handler (RefundPaymentEventHandler) 
   *      - check if the order event is 'canceled'
   *      - cancel the payement (e.g., send cancel request to the stripe) 
   *
   *  - note:
   *    - does not matter about elagibility of refund in this case. this is because if the admin want to cancel the order even if not eligible and give more flexible choice to the admin.
   *
   **/
  //@PostMapping("/orders/{orderId}/refund-after-shippment")
  //@PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  //public ResponseEntity<BaseResponse> refundOrderAfterShipment(
  //    @PathVariable(value = "orderId") UUID orderId,
  //    //@Valid @RequestBody OrderEventCriteria criteria, 
  //    @AuthenticationPrincipal SpringSecurityUser authUser
  //    ) throws Exception {

  //  this.service.refundOrderAfterShipment(orderId);

	//  return new ResponseEntity<>(
  //      new BaseResponse("confirmed refund request successfully"),
  //      HttpStatus.OK
  //      );
  //}

  /**
   * refund request to the order before shipment made.
   *
   * Called by only admin. once the admin make sure the request from the customer, he can send a request to this endpoint.
   *
   * Firstly, the customer send a request for cancel (e.g., adding an order event of 'Cancel_REQUEST'). then the admin confirm the request and click the refund button (only visible if order status is received_cancel_request) for the cancel. once the admin is ready to cancel, he can send a request to this endpoint. 
   *
   * Add 'CANCELED' order event internally.
   *
   * So, Call this after "RECEIVED_CANCEL_REQUEST" event.
   *
   * @2021/07/09: change
   *
   *  - to make this process easy, decided to call 'refundBeforeShipment' internally inside event handler.
   *  
   *  - flow:
   *    1. the admin add order event (CANCELED). make sure to display a prompt that this is undoable since payment is canceled.
   *    2. publish an event (OrderEventWasAddedEvent@OrderService#addOrderEvent)
   *    3. the event handler (RefundPaymentEventHandler) 
   *      - check if the order event is 'canceled'
   *      - cancel the payement (e.g., send cancel request to the stripe) 
   *
   *  - note:
   *    - does not matter about elagibility of refund in this case. this is because if the admin want to cancel the order even if not eligible and give more flexible choice to the admin.
   *
   **/
  //@PostMapping("/orders/{orderId}/refund-before-shipment")
  //@PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  //public ResponseEntity<BaseResponse> refundOrderBeforeShipment(
  //    @PathVariable(value = "orderId") UUID orderId,
  //    //@Valid @RequestBody OrderEventCriteria criteria, 
  //    @AuthenticationPrincipal SpringSecurityUser authUser
  //    ) throws Exception {

  //  this.service.refundBeforeShipment(orderId);

	//  return new ResponseEntity<>(
  //      new BaseResponse("confirmed refund request successfully"),
  //      HttpStatus.OK
  //      );
  //}

  /**
   * test event endpoint 
   *
   **/
  @GetMapping("/orders/test-event")
  public ResponseEntity<String> testEvent(
      ) throws Exception {

    this.service.testEvent();

	  return new ResponseEntity<>(
        "added order event successfully",
        HttpStatus.OK
        );
  }
}

