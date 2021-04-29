import { PayloadAction, createSlice, createAction } from "@reduxjs/toolkit";

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request
export const requestStripeClientSecretActionCreator = createAction("saga/app/private/stripeClientSecret/request")
export const requestStripeClientSecretActionTypeName = requestStripeClientSecretActionCreator().type


/**
 * app.fetchStatus.cartItems.get state Slice (no side effects)
 **/
export type StripeClientSecretActionType = PayloadAction<string>

export const stripeClientSecretSlice = createSlice({
  name: "app/private/stripeClientSecret", // a name used in action type
  initialState: "",
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
    update: (state: string, action: StripeClientSecretActionType) => action.payload,
    clear: (state: string) => "" 
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const stripeClientSecretSliceReducer = stripeClientSecretSlice.reducer
export const stripeClientSecretActions = stripeClientSecretSlice.actions


