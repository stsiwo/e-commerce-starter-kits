import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";

/**
 * app.fetchStatus.review.get state Slice
 **/
export type getReviewFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getReviewFetchStatusSlice = createSlice({
  name: "app/fetchStatus/review/get", // a name used in action type
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


/**
 * app.fetchStatus.review.post state Slice
 **/
export type postReviewFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postReviewFetchStatusSlice = createSlice({
  name: "app/fetchStatus/review/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postReviewFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postReviewFetchStatusSliceReducer = postReviewFetchStatusSlice.reducer
export const postReviewFetchStatusActions = postReviewFetchStatusSlice.actions


/**
 * app.fetchStatus.review.put state Slice
 **/
export type putReviewFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putReviewFetchStatusSlice = createSlice({
  name: "app/fetchStatus/review/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putReviewFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putReviewFetchStatusSliceReducer = putReviewFetchStatusSlice.reducer
export const putReviewFetchStatusActions = putReviewFetchStatusSlice.actions


/**
 * app.fetchStatus.review.deleteSingle state Slice
 **/
export type deleteSingleReviewFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteSingleReviewFetchStatusSlice = createSlice({
  name: "app/fetchStatus/review/deleteSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteSingleReviewFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteSingleReviewFetchStatusSliceReducer = deleteSingleReviewFetchStatusSlice.reducer
export const deleteSingleReviewFetchStatusActions = deleteSingleReviewFetchStatusSlice.actions

