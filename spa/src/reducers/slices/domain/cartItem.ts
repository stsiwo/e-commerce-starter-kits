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
export const putCartItemActionCreator = createAction("saga/domain/cartItem/put")
export const putCartItemActionTypeName = putCartItemActionCreator().type

// for DELETE (delete single cart item) request
export const deleteSingleCartItemActionCreator = createAction("saga/domain/cartItem/deleteSingle")
export const deleteSingleCartItemActionTypeName = deleteSingleCartItemActionCreator().type

// for DELETE (delete all of cart items) request
export const deleteCartItemActionCreator = createAction("saga/domain/cartItem/delete")
export const deleteCartItemActionTypeName = deleteCartItemActionCreator().type

/**
 *
 * domain.cartItems state Slice (no side effects)
 *
 **/
// action type             
export type CartItemActionType = PayloadAction<CartItemType[]> 

export const cartItemSlice = createSlice({ 
  name: "domain/categories", // a name used in action type
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

    // use when update existing one
    merge: (state: CartItemType[], action: CartItemActionType) => merge(state, action.payload),

    // use when you want to replace
    update: (state: CartItemType[], action: CartItemActionType) => action.payload,

    // use when you want to remove a single entity
    delete: (state: CartItemType[], action: PayloadAction<CartItemType>) => remove(state, (cartItem: CartItemType) => cartItem.cartId == action.payload.cartId),

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

