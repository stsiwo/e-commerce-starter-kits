import { OrderType, OrderStatusEnum, OrderAddressType, OrderDetailCriteria } from "./types";
import { UserAddressType } from "domain/user/types";
import { CartItemType } from "domain/cart/types";

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

export function toOrderAddress(address: UserAddressType): OrderAddressType {
  return {
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    province: address.province,
    country: address.country,
    postalCode: address.postalCode,
  } as OrderAddressType
}


export function toOrderDetailCriteriaList(cartItems: CartItemType[]): OrderDetailCriteria[] {
  return cartItems
    // make sure only pick selected one
    .filter((cartItem: CartItemType) => cartItem.isSelected)
    .map((cartItem: CartItemType) => ({
      productQuantity: cartItem.quantity,
      productId: cartItem.product.productId,
      productVariantId: cartItem.product.variants[0].variantId, // only include selected variant
    } as OrderDetailCriteria))
}

