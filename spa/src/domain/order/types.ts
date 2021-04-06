import { UserType } from "src/app";
import { ProductType } from "domain/product/types";

export enum OrderStatusEnum {
  DRAFT = "DRAFT",
  ORDERED = "ORDERED",
  FAILED_PAYMENT = "FAILED_PAYMENT",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  RECEIVED_RETURN_REQUEST = "RECEIVED_RETURN_REQUEST",
  RETURNED = "RETURNED",
  RECEIVED_CANCEL_REQUEST = "RECEIVED_CANCEL_REQUEST",
  CANCELED = "CANCELED",
}

export declare type OrderEventType = {
  orderEventId: string
  createdAt: Date
  orderId: string
  orderStatus: OrderStatusEnum
  undoable: boolean
  isUndo: boolean
  user: UserType
}

export declare type OrderDetailType = {
  orderDetailId: string,
  productQuantity: number,
  productUnitPrice: number,
  productColor: string,
  productSize: string,
  productName: string
  product?: ProductType // if still the product exist
}

export declare type OrderType = {
  orderId: string
  user: UserType
  orderNumber: string
  orderEvents: OrderEventType[]
  orderDetails: OrderDetailType[]
  productCost: number
  taxCost: number
  note: string
  createdAt: Date
  updatedAt: Date
}
