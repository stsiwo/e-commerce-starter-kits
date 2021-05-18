import { ProductType } from "domain/product/types";
import { UserType } from "domain/user/types";

export declare type CartItemType = {
  cartItemId?: string
  user: UserType
  /**
   *  - assuming that this product only contains a selected product.
   **/
  product: ProductType
  quantity: number
  isSelected: boolean
  createdAt: Date
}

// form data
export declare type CartItemDataType = {
  cartItemId?: string,
  userId: string,
  variantId: string
  isSelected: boolean
  quantity: number
}
