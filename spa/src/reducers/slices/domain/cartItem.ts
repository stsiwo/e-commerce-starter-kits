import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemType } from "domain/cart/types";
import merge from "lodash/merge";
import remove from 'lodash/remove';

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request
export const fetchCartItemActionCreator = createAction("saga/domain/cartItem/fetch")
export const fetchCartItemActionTypeName = fetchCartItemActionCreator().type

// for POST (add a new cart item) request
export const postCartItemActionCreator = createAction<CartItemType>("saga/domain/cartItem/post")
export const postCartItemActionTypeName = postCartItemActionCreator().type

// for PUT (replace) request
export const putCartItemActionCreator = createAction<CartItemType>("saga/domain/cartItem/put")
export const putCartItemActionTypeName = putCartItemActionCreator().type

// for DELETE (delete single cart item) request
export const deleteSingleCartItemActionCreator = createAction<CartItemType>("saga/domain/cartItem/deleteSingle")
export const deleteSingleCartItemActionTypeName = deleteSingleCartItemActionCreator().type

// for DELETE (delete all of cart items) request
export const deleteCartItemActionCreator = createAction<CartItemType>("saga/domain/cartItem/delete")
export const deleteCartItemActionTypeName = deleteCartItemActionCreator().type

/**
 *
 * domain.cartItems state Slice (no side effects)
 *
 **/
// action type             
export type CartItemActionType = PayloadAction<CartItemType[]> 

export const cartItemSlice = createSlice({ 
  name: "domain/cartItem", // a name used in action type
  initialState: {},        
  reducers: {              
    /**
     *
     *  a property name gonna be the name of action
     *  its value is the reduce
     *
     *  If you need to define the param of the action, use PayloadAction<X> to define its type.
     *  In this use case, I need to an string param, so I define 'payloadAction<string' like below
     *
     **/

    // use when update existing one (only apply for array: don't use for object)
    updateOne: (state: CartItemType[], action: PayloadAction<CartItemType>) => {
      return state.map((domain: CartItemType) => {
        if (domain.cartItemId === action.payload.cartItemId) {
          return action.payload
        }
        return domain
      })
    },

    append: (state: CartItemType[], action: PayloadAction<CartItemType>) => {
      state.push(action.payload);
      return state
    },

    // use when you want to replace the whole array
    update: (state: CartItemType[], action: CartItemActionType) => {
      console.log("inside cart item reducer")
      console.log(action.payload)
      return action.payload;
    },
    // use when you want to remove a single entity
    delete: (state: CartItemType[], action: PayloadAction<CartItemType>) => {
      /**
       * mutable.
       * original one: the rest of elements
       * return one: the removed elements
       **/
      remove(state, (cartItem: CartItemType) => cartItem.cartItemId == action.payload.cartItemId)
      return state
    },

    deleteSelectedItemsByProduct: (state: CartItemType[], action: PayloadAction<{ productId: string, productVariantId: string }[]>) => {
      // remove if condition met (2nd arg)
      remove(state, (cartItem: CartItemType) => { 
        // condition 
        return action.payload.find((ele) => {
          return cartItem.isSelected && cartItem.product.productId == ele.productId && cartItem.product.variants[0].variantId == ele.productVariantId
        })
      })
      return state
    },

    deleteSelectedItems: (state: CartItemType[]) => {
      remove(state, (cartItem: CartItemType) => cartItem.isSelected)
      return state
    },

    clear: (state: CartItemType[]) => [],
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const cartItemSliceReducer = cartItemSlice.reducer
export const cartItemActions = cartItemSlice.actions

