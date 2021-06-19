import { UserTypeEnum } from "src/app";
import { ProductType, ProductVariantType } from "domain/product/types";
import DraftsIcon from '@material-ui/icons/Drafts';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PaymentIcon from '@material-ui/icons/Payment';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import HomeIcon from '@material-ui/icons/Home';
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import ErrorIcon from '@material-ui/icons/Error';
import { theme } from "ui/css/theme";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";
import { UserType, UserAddressType } from "domain/user/types";

export enum OrderStatusEnum {
  DRAFT = "DRAFT",
  SESSION_TIMEOUT = "SESSION_TIMEOUT",
  ORDERED = "ORDERED",
  FAILED_PAYMENT = "FAILED_PAYMENT",
  PAID = "PAID",
  CANCEL_REQUEST = "CANCEL_REQUEST",
  RECEIVED_CANCEL_REQUEST = "RECEIVED_CANCEL_REQUEST",
  CANCELED = "CANCELED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  RETURN_REQUEST = "RETURN_REQUEST",
  RECEIVED_RETURN_REQUEST = "RECEIVED_RETURN_REQUEST",
  RETURNED = "RETURNED",
  ERROR = "ERROR",
}

export declare type OrderStatusLabelListType = {
  [key in OrderStatusEnum]: string
}

export const orderStatusLabelList: OrderStatusLabelListType = {
  [OrderStatusEnum.DRAFT]: "Draft",
  [OrderStatusEnum.ORDERED]: "Ordered",
  [OrderStatusEnum.FAILED_PAYMENT]: "Failed Payment",
  [OrderStatusEnum.PAID]: "Paid",
  [OrderStatusEnum.CANCEL_REQUEST]: "Cancel Request",
  [OrderStatusEnum.RECEIVED_CANCEL_REQUEST]: "Received Cancel Request",
  [OrderStatusEnum.CANCELED]: "Canceled",
  [OrderStatusEnum.SHIPPED]: "Shipped",
  [OrderStatusEnum.DELIVERED]: "Delivered",
  [OrderStatusEnum.RETURN_REQUEST]: "Return Request",
  [OrderStatusEnum.RECEIVED_RETURN_REQUEST]: "Received Return Request",
  [OrderStatusEnum.RETURNED]: "Returned",
  [OrderStatusEnum.ERROR]: "Error",
  [OrderStatusEnum.SESSION_TIMEOUT]: "Session Timeout",
}

export enum OrderSortEnum {
  DATE_DESC = "DATE_DESC",
  DATE_ASC = "DATE_ASC",
}

export declare type OrderStatusNextOptionType = {
  [kye in UserTypeEnum]?: OrderStatusEnum[]
}

export declare type OrderStatusBagType = {
  label: string,
  defaultNote: string
  icon: OverridableComponent<SvgIconTypeMap<Record<string, never>, "svg">>,
  color: string
  nextOptions?: OrderStatusNextOptionType
}


export declare type OrderStatusBagListType = {
  [key in OrderStatusEnum]: OrderStatusBagType
}

export const orderStatusBagList: OrderStatusBagListType = {
  [OrderStatusEnum.DRAFT]: {
    label: "Draft",
    defaultNote: "the order draft received.",
    icon: DraftsIcon,
    color: theme.palette.success.main
  },
  [OrderStatusEnum.FAILED_PAYMENT]: {
    label: "Failed Payment:(",
    defaultNote: "the customer failed payment.",
    icon: PaymentIcon,
    color: theme.palette.error.main,
  },
  [OrderStatusEnum.PAID]: {
    label: "Paid:)",
    defaultNote: "the customer failed payment.",
    icon: PaymentIcon,
    color: theme.palette.success.main
  },
  [OrderStatusEnum.ORDERED]: {
    label: "Ordered!",
    defaultNote: "the order draft submitted.",
    icon: ShoppingCartIcon,
    color: theme.palette.success.main,
  },
  [OrderStatusEnum.CANCEL_REQUEST]: {
    label: "Sent Cancel Request:(",
    defaultNote: "the customer submitted cancelation request",
    icon: CancelPresentationIcon,
    color: theme.palette.error.main,
  },
  [OrderStatusEnum.RECEIVED_CANCEL_REQUEST]: {
    label: "Received Cancel Request:(",
    defaultNote: "we confirmed cancelation request",
    icon: CancelPresentationIcon,
    color: theme.palette.error.main,
  },
  [OrderStatusEnum.CANCELED]: {
    label: "Canceled:)",
    defaultNote: "we canceled the order successfully.",
    icon: AssignmentTurnedInIcon,
    color: theme.palette.success.main,
  },
  [OrderStatusEnum.SHIPPED]: {
    label: "Shipped:)",
    defaultNote: "we shipped the products successfully.",
    icon: LocalShippingIcon,
    color: theme.palette.success.main,
  },
  [OrderStatusEnum.DELIVERED]: {
    label: "Delivered:)",
    defaultNote: "we delivered the package successfully.",
    icon: HomeIcon,
    color: theme.palette.success.main,
  },
  [OrderStatusEnum.RETURN_REQUEST]: {
    label: "Sent Return Request:)",
    defaultNote: "the customer submitted return request.",
    icon: AssignmentReturnIcon,
    color: theme.palette.error.main,
  },
  [OrderStatusEnum.RECEIVED_RETURN_REQUEST]: {
    label: "Received Return Request:)",
    defaultNote: "we confirmed return request.",
    icon: AssignmentReturnIcon,
    color: theme.palette.error.main,
  },
  [OrderStatusEnum.RETURNED]: {
    label: "Returned:)",
    defaultNote: "we processed the request successfully.",
    icon: AssignmentTurnedInIcon,
    color: theme.palette.success.main,
  },
  [OrderStatusEnum.SESSION_TIMEOUT]: {
    label: "Session Timeout:(",
    defaultNote: "the customer timeed out his session.",
    icon: TimerOffIcon,
    color: theme.palette.error.main,
  },
  [OrderStatusEnum.ERROR]: {
    label: "Error:)",
    defaultNote: "unexpected error happened.",
    icon: ErrorIcon,
    color: theme.palette.error.main,
  },
}

// helper function
//// check function
export const hasNextOrderOptions: (orderStatusBag: OrderStatusBagType, targetUserType: UserTypeEnum) => boolean = (orderStatusBag, targetUserType) => {
  if (!orderStatusBag) return false
 
  return orderStatusBag.nextOptions &&
    orderStatusBag.nextOptions[targetUserType] &&
    orderStatusBag.nextOptions[targetUserType].length > 0
}

// type def

export declare type OrderAddressType = {
  addressId?: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  postalCode: string
}

export declare type OrderEventType = {
  orderEventId?: string
  createdAt: Date
  orderId: string
  orderStatus: OrderStatusEnum
  undoable: boolean
  user: UserType
  note: string
}

export declare type OrderDetailType = {
  orderDetailId: string,
  productQuantity: number,
  productUnitPrice: number,
  productColor: string,
  productSize: string,
  productName: string
  productVariant: ProductVariantType // selected variant
  product?: ProductType // if still the product exist
  isReviewable?: boolean
}

export declare type OrderType = {
  orderId: string
  user: UserType
  orderNumber: string
  orderFirstName: string
  orderLastName: string
  orderEmail: string
  orderPhone: string
  shippingAddress: UserAddressType
  billingAddress: UserAddressType
  orderEvents: OrderEventType[]
  orderDetails: OrderDetailType[]
  productCost: number
  taxCost: number
  shippingCost: number
  note: string
  createdAt: Date
  updatedAt: Date
  nextAdminOrderEventOptions: OrderStatusEnum[],
  nextMemberOrderEventOptions: OrderStatusEnum[],
  latestOrderEvent: OrderEventType,
}

// form & input state
export const defaultOrderEventData: OrderEventType = {
  createdAt: null,
  undoable: false,
  user: null,
  orderId: "",
  orderStatus: null,
  note: "",
}

// criteria

export declare type SessionTimeoutOrderEventCriteria = {
  orderNumber: string
}

export declare type OrderDetailCriteria = {
  orderDetailId: string,
  productQuantity: number,
  productVariantId: string // selected variant
  productId: string // if still the product exist
}

export declare type OrderCriteria = {
  orderId?: string
  orderNumber?: string
  orderFirstName: string
  orderLastName: string
  orderEmail: string
  orderPhone: string
  shippingAddress: OrderAddressType
  billingAddress: OrderAddressType
  note: string
  userId: string
  orderDetails: OrderDetailCriteria[]
  orderEvents?: string[]
  currency: string
}

export declare type OrderEventCriteria = {
  orderEventId?: string
  orderStatus?: OrderStatusEnum
  note: string
  userId: string
}
