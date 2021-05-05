import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";

/**
 * app.fetchStatus.review.get state Slice
 **/
export type getReviewFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getReviewFetchStatusSlice = createSlice({
  name: "app/fetchStatus/review/get", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getReviewFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getReviewFetchStatusSliceReducer = getReviewFetchStatusSlice.reducer
export const getReviewFetchStatusActions = getReviewFetchStatusSlice.actions


