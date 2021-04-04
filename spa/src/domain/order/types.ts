import { UserType } from "src/app";

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

export declare type OrderType = {
  orderId: string
  user: UserType
  orderNumber: string
  orderDate?: Date
  failedPaymentDate?: Date
  paymentDate?: Date
  receivedCancelRequestDate?: Date
  canceledDate?: Date
  shippedDate?: Date
  receivedReturnRequestDate?: Date
  returnedDate?: Date
  isOrdered: boolean
  isFailedPayment: boolean
  isPaid: boolean
  isReceivedCancelRequest: boolean
  isCanceled: boolean
  isShipped: boolean
  isReceivedReturnRequest: boolean
  isReturned: boolean
  productCost: number
  taxCost: number
  note: number
  orderStatus: OrderStatusEnum
  createdAt: Date
  updatedAt: Date
}
