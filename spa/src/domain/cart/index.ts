import { CartItemType } from "./types";

export const calcSubTotalPriceAmount: (cartItems: CartItemType[]) => number = (cartItems) => {
    return cartItems.reduce((acc: number, cartItem: CartItemType) => {
      const unitPrice = cartItem.product.variants[0].variantUnitPrice ? cartItem.product.variants[0].variantUnitPrice : cartItem.product.productBaseUnitPrice
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

export const calcTotalWeight: (cartItems: CartItemType[]) => number = (cartItems) => {
    return cartItems.reduce((acc: number, cartItem: CartItemType) => {
      acc +=  cartItem.product.variants[0].weight 
      return acc
    }, 0)
}



