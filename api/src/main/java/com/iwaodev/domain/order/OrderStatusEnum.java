package com.iwaodev.domain.order;

public enum OrderStatusEnum {
  
  DRAFT,
  SESSION_TIMEOUT,  
  ORDERED,
  PAID,
  PAYMENT_FAILED,
  CANCEL_REQUEST, // cancel => refund before shipment && undoable
  RECEIVED_CANCEL_REQUEST,
  CANCELED, // undoable
  SHIPPED, // undoable
  DELIVERED, // undoable
  RETURN_REQUEST, // return => refund after shipment && undoable
  RECEIVED_RETURN_REQUEST, // return => refund after shipment && undoable
  RETURNED,  // undoable
  ERROR, // undoable
}

