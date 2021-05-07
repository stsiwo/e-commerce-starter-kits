import { ProductType } from "domain/product/types";
import { UserType } from "domain/user/types";

export declare type CartItemType = {
  cartId?: string
  user: UserType
  /**
   *  - assuming that this product only contains a selected product.
   **/
  product: ProductType
  quantity: number
  isSelected: boolean
  createdAt: Date
  updatedAt: Date
}
