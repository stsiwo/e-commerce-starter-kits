import { OrderType, OrderStatusEnum } from "./types";

/**
 * domain behaviors
 *
 **/
export const calcOrderTotalCost: (order: OrderType) => number = (order) => {
  return order.productCost + order.taxCost + order.shippingCost;
}

export const calcOrderTotalItemNumber: (order: OrderType) => number = (order) => {
  return order.orderDetails.length;
}

export const getCurOrderStatus: (order: OrderType) => OrderStatusEnum = (order) => {
  return order.orderEvents[order.orderEvents.length - 1].orderStatus;
}

