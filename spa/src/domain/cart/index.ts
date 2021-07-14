import { ProductType } from "domain/product/types";
import { getNanoId } from "src/utils";
import { CartItemType } from "./types";

export const calcSubTotalPriceAmount: (cartItems: CartItemType[]) => number = (cartItems) => {
  return cartItems.reduce((acc: number, cartItem: CartItemType) => {
    if (cartItem.isSelected) {
      const unitPrice = cartItem.product.variants[0].currentPrice
      acc += (unitPrice * cartItem.quantity)
    }
    return acc
  }, 0)
}

export const calcSubTotalProductNumbers: (cartItems: CartItemType[]) => number = (cartItems) => {
  return cartItems.reduce((acc: number, cartItem: CartItemType) => {
    if (cartItem.isSelected) {
      acc += cartItem.quantity
    }
    return acc
  }, 0)
}

export const calcTotalWeight: (cartItems: CartItemType[]) => number = (cartItems) => {
  return cartItems.reduce((acc: number, cartItem: CartItemType) => {
    // don't forget include quantity
    acc += (cartItem.product.variants[0].variantWeight * cartItem.quantity)
    return acc
  }, 0)
}

/**
 * validate cartItem if the customer moves to checkout.
 *
 * - at least one item must be selected.
 *
 **/
export const validateCartItemsForCheckout: (cartItems: CartItemType[]) => boolean = (cartItems) => {
  const selectedItems = cartItems.filter((cartItem: CartItemType) => cartItem.isSelected === true);
  return selectedItems.length > 0;
}



/**
 * create new cart item.
 *
 * used when move wishlist to cart item.
 *
 * used for only guest user. for member users, fetch from api.
 *
 **/
export const createCartItem: (variantId: string, filteredProduct: ProductType) => CartItemType = (variantId, filteredProduct) => {
  return {
    cartItemId: getNanoId(),
    createdAt: new Date(Date.now()),
    isSelected: true,
    product: filteredProduct,
    quantity: 1,
    user: null
  } as CartItemType
}

/**
 * create a cart item criteria for a request body from a cart item entity.
 *
 * if the product of the cart item entity includes the selected variant only, you don't need to specify the 2nd arg.
 *
 * if the product of the cart item entity includes all the variants of it, you should provide your selected variantId explicitly as the 2nd arg.
 *
 **/
//export const mapToCriteria: (cartItem: CartItemType, variantId?: string) => CartItemCriteria = (cartItem, variantId?) => {
//  return {
//    ...(cartItem.cartItemId ? { cartItemId: cartItem.cartItemId } : {}),
//    variantId: variantId ? variantId : cartItem.product.variants[0],
//    isSelected: cartItem.isSelected,
//    quantity: cartItem.quantity,
//    userId: cartItem.user ? cartItem.user.userId : null,
//  } as CartItemCriteria
//}


