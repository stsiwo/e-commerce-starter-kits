import { UserTypeEnum } from "src/app";
import { ProductType } from "domain/product/types";
import DraftsIcon from '@material-ui/icons/Drafts';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PaymentIcon from '@material-ui/icons/Payment';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import ErrorIcon from '@material-ui/icons/Error';
import { theme } from "ui/css/theme";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";
import { UserType } from "domain/user/types";

export enum OrderStatusEnum {
  DRAFT = "DRAFT",
  ORDERED = "ORDERED",
  FAILED_PAYMENT = "FAILED_PAYMENT",
  PAYMENT_AGAIN = "PAYMENT_AGAIN",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  RECEIVED_RETURN_REQUEST = "RECEIVED_RETURN_REQUEST",
  RETURNED = "RETURNED",
  RECEIVED_CANCEL_REQUEST = "RECEIVED_CANCEL_REQUEST",
  CANCELED = "CANCELED",
  ERROR = "ERROR",
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
    nextOptions: {
      [UserTypeEnum.ADMIN]: [
        OrderStatusEnum.ERROR
      ],
      [UserTypeEnum.MEMBER]: [
        OrderStatusEnum.PAYMENT_AGAIN
      ]
    }
  },
  [OrderStatusEnum.PAYMENT_AGAIN]: {
    label: "Payment Again",
    defaultNote: "the customer made payment again",
    icon: PaymentIcon,
    color: theme.palette.error.main,
    nextOptions: {
      [UserTypeEnum.ADMIN]: [
        OrderStatusEnum.PAID,
        OrderStatusEnum.FAILED_PAYMENT,
      ],
      [UserTypeEnum.MEMBER]: [
        OrderStatusEnum.RECEIVED_CANCEL_REQUEST
      ]
    }
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
    nextOptions: {
      [UserTypeEnum.ADMIN]: [
        OrderStatusEnum.SHIPPED,
        OrderStatusEnum.ERROR
      ],
      [UserTypeEnum.MEMBER]: [
        OrderStatusEnum.RECEIVED_CANCEL_REQUEST
      ]
    }
  },
  [OrderStatusEnum.RECEIVED_CANCEL_REQUEST]: {
    label: "Received Cancel Request:(",
    defaultNote: "the customer submitted cancelation request",
    icon: CancelPresentationIcon,
    color: theme.palette.error.main,
    nextOptions: {
      [UserTypeEnum.ADMIN]: [
        OrderStatusEnum.CANCELED,
        OrderStatusEnum.ERROR
      ]
    }
  },
  [OrderStatusEnum.CANCELED]: {
    label: "Canceled:)",
    defaultNote: "we canceled the order successfully.",
    icon: CancelPresentationIcon,
    color: theme.palette.success.main,
    nextOptions: {
      [UserTypeEnum.ADMIN]: [
        OrderStatusEnum.COMPLETED,
        OrderStatusEnum.ERROR
      ],
    }
  },
  [OrderStatusEnum.SHIPPED]: {
    label: "Shipped:)",
    defaultNote: "we shipped the products successfully.",
    icon: LocalShippingIcon,
    color: theme.palette.success.main,
    nextOptions: {
      [UserTypeEnum.ADMIN]: [
        OrderStatusEnum.COMPLETED,
        OrderStatusEnum.ERROR
      ],
      [UserTypeEnum.MEMBER]: [
        OrderStatusEnum.RECEIVED_RETURN_REQUEST
      ]
    }
  },
  [OrderStatusEnum.COMPLETED]: {
    label: "Completed:)",
    defaultNote: "we completed the order successfully.",
    icon: AssignmentTurnedInIcon,
    color: theme.palette.success.main,
    nextOptions: {
      [UserTypeEnum.MEMBER]: [
        OrderStatusEnum.RECEIVED_RETURN_REQUEST
      ]
    }
  },
  [OrderStatusEnum.RECEIVED_RETURN_REQUEST]: {
    label: "Received Return Request:)",
    defaultNote: "the customer submitted return request.",
    icon: AssignmentReturnIcon,
    color: theme.palette.error.main,
    nextOptions: {
      [UserTypeEnum.ADMIN]: [
        OrderStatusEnum.RETURNED,
        OrderStatusEnum.ERROR
      ],
    }
  },
  [OrderStatusEnum.RETURNED]: {
    label: "Returned:)",
    defaultNote: "we recevied the products successfully.",
    icon: AssignmentReturnIcon,
    color: theme.palette.success.main,
    nextOptions: {
      [UserTypeEnum.ADMIN]: [
        OrderStatusEnum.COMPLETED,
        OrderStatusEnum.ERROR
      ],
    }
  },
  [OrderStatusEnum.ERROR]: {
    label: "Error:)",
    defaultNote: "unexpected error happened.",
    icon: ErrorIcon,
    color: theme.palette.error.main,
    nextOptions: {
      [UserTypeEnum.ADMIN]: [
        OrderStatusEnum.COMPLETED
      ],
    }
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

export declare type OrderEventType = {
  orderEventId?: string
  createdAt: Date
  orderId: string
  orderStatus: OrderStatusEnum
  undoable: boolean
  isUndo: boolean
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

// form & input state
export const defaultOrderEventData: OrderEventType = {
  createdAt: null,
  isUndo: false,
  undoable: false,
  user: null,
  orderId: "",
  orderStatus: null,
  note: "",
}
