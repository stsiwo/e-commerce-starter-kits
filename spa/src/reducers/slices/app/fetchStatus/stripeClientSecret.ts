import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";

/**
 * app.fetchStatus.product.get state Slice
 **/
export type stripeClientSecretFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const stripeClientSecretFetchStatusSlice = createSlice({
  name: "app/fetchStatus/stripeClientSecret", // a name used in action type
  initialState: FetchStatusEnum.INITIAL,
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
    update: (state: FetchStatusEnum, action: stripeClientSecretFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const stripeClientSecretFetchStatusSliceReducer = stripeClientSecretFetchStatusSlice.reducer
export const stripeClientSecretFetchStatusActions = stripeClientSecretFetchStatusSlice.actions


