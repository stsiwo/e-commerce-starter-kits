import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { OrderType, CheckoutSessionStatusEnum } from "domain/order/types";
import { resetCheckoutStateActionTypeName } from "../common";

/**
 *
 * domain.checkout.order state Slice (no side effects)
 *
 **/
// action type             
export type CheckoutSessionStatusActionType = PayloadAction<CheckoutSessionStatusEnum> 

export const checkoutSessionStatusSlice = createSlice({ 
  name: "domain/checkout/sessionStatus", // a name used in action type
  initialState: CheckoutSessionStatusEnum.INITIAL,        
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

    // use when you want to replace
    update: (state: CheckoutSessionStatusEnum, action: CheckoutSessionStatusActionType) => action.payload,
    clear: (state: CheckoutSessionStatusEnum) => CheckoutSessionStatusEnum.INITIAL, 
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
  extraReducers: {
    [resetCheckoutStateActionTypeName]: (state: CheckoutSessionStatusEnum) => CheckoutSessionStatusEnum.INITIAL 
  },
}) 

export const checkoutSessionStatusSliceReducer = checkoutSessionStatusSlice.reducer
export const checkoutSessionStatusActions = checkoutSessionStatusSlice.actions



// action type             
export type CheckoutOrderActionType = PayloadAction<OrderType> 

export const checkoutOrderSlice = createSlice({ 
  name: "domain/checkout/order", // a name used in action type
  initialState: null,        
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

    // use when you want to replace
    update: (state: OrderType, action: CheckoutOrderActionType) => action.payload,
    clear: (state: OrderType) => null, // start from 0, (not 1)
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
  extraReducers: {
    [resetCheckoutStateActionTypeName]: (state: OrderType) => null 
  },
}) 

export const checkoutOrderSliceReducer = checkoutOrderSlice.reducer
export const checkoutOrderActions = checkoutOrderSlice.actions


// action type             
export type CheckoutIsRatingSuccessActionType = PayloadAction<boolean> 

export const checkoutIsRatingSuccessSlice = createSlice({ 
  name: "domain/checkout/isRatingSuccess", // a name used in action type
  initialState: false,        
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

    // use when you want to replace
    update: (state: boolean, action: CheckoutIsRatingSuccessActionType) => action.payload,
    clear: (state: boolean) => false, 
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
  extraReducers: {
    [resetCheckoutStateActionTypeName]: (state: boolean) => false 
  },
}) 

export const checkoutIsRatingSuccessSliceReducer = checkoutIsRatingSuccessSlice.reducer
export const checkoutIsRatingSuccessActions = checkoutIsRatingSuccessSlice.actions



