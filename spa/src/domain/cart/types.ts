import { ProductType, ProductVariantType } from "domain/product/types";
import { UserType } from "domain/user/types";

export declare type CartItemType = {
  cartId?: string
  user: UserType
  /**
   * hmm.. should i keep variant or product?
   *
   *  - assuming that this product only contains a selected product.
   *
   *  #TODO: refactor based on the logic you decide.
   *
   **/
  product: ProductType
  variant: ProductVariantType
  quantity: number
  isSelected: boolean
  createdAt: Date
  updatedAt: Date
}
