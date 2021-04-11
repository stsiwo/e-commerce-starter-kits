import { CartItemType } from "./types";

export const calcSubTotalPriceAmount: (cartItems: CartItemType[]) => number = (cartItems) => {
    return cartItems.reduce((acc: number, cartItem: CartItemType) => {
      const unitPrice = cartItem.variant.variantUnitPrice ? cartItem.variant.variantUnitPrice : cartItem.product.productBaseUnitPrice
      acc +=  (unitPrice * cartItem.quantity)
      return acc
    }, 0)
  }

export const calcSubTotalProductNumbers: (cartItems: CartItemType[]) => number = (cartItems) => {
    return cartItems.reduce((acc: number, cartItem: CartItemType) => {
      acc +=  cartItem.quantity 
      return acc
    }, 0)
  }

