import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import merge from "lodash/merge";
import remove from 'lodash/remove';
import { OrderType } from "domain/order/types";

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request
export const fetchOrderActionCreator = createAction("saga/domain/order/fetch")
export const fetchOrderActionTypeName = fetchOrderActionCreator().type

// for GET by Id request
export const fetchSingleOrderActionCreator = createAction<{ orderId: string }>("saga/domain/order/fetchSingle")
export const fetchSingleOrderActionTypeName = fetchSingleOrderActionCreator().type

// for POST (add a new cart item) request
export const postOrderActionCreator = createAction<OrderType>("saga/domain/order/post")
export const postOrderActionTypeName = postOrderActionCreator().type

// for PUT (replace) request
export const putOrderActionCreator = createAction<OrderType>("saga/domain/order/put")
export const putOrderActionTypeName = putOrderActionCreator().type

// for DELETE (delete single cart item) request
export const deleteSingleOrderActionCreator = createAction<OrderType>("saga/domain/order/deleteSingle")
export const deleteSingleOrderActionTypeName = deleteSingleOrderActionCreator().type

// for DELETE (delete all of cart items) request
export const deleteOrderActionCreator = createAction<OrderType>("saga/domain/order/delete")
export const deleteOrderActionTypeName = deleteOrderActionCreator().type

/**
 *
 * domain.orders state Slice (no side effects)
 *
 **/
// action type             
export type OrderActionType = PayloadAction<OrderType[]> 

export const orderSlice = createSlice({ 
  name: "domain/order", // a name used in action type
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
    merge: (state: OrderType[], action: OrderActionType) => merge(state, action.payload),

    // use when you want to replace
    update: (state: OrderType[], action: OrderActionType) => action.payload,

    // use when you want to remove a single entity
    delete: (state: OrderType[], action: PayloadAction<OrderType>) => remove(state, (order: OrderType) => order.orderId == action.payload.orderId),

    clear: (state: OrderType[]) => [],
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const orderSliceReducer = orderSlice.reducer
export const orderActions = orderSlice.actions

