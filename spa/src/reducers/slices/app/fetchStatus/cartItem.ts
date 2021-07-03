import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";

/**
 * app.fetchStatus.cartItems.get state Slice
 **/
export type getCartItemFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getCartItemFetchStatusSlice = createSlice({
  name: "app/fetchStatus/cartItem/get", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getCartItemFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getCartItemFetchStatusSliceReducer = getCartItemFetchStatusSlice.reducer
export const getCartItemFetchStatusActions = getCartItemFetchStatusSlice.actions

/**
 * app.fetchStatus.cartItems.post state Slice
 **/
export type postCartItemFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postCartItemFetchStatusSlice = createSlice({
  name: "app/fetchStatus/cartItem/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postCartItemFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postCartItemFetchStatusSliceReducer = postCartItemFetchStatusSlice.reducer
export const postCartItemFetchStatusActions = postCartItemFetchStatusSlice.actions

/**
 * app.fetchStatus.cartItems.put state Slice
 **/
export type putCartItemFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putCartItemFetchStatusSlice = createSlice({
  name: "app/fetchStatus/cartItem/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putCartItemFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putCartItemFetchStatusSliceReducer = putCartItemFetchStatusSlice.reducer
export const putCartItemFetchStatusActions = putCartItemFetchStatusSlice.actions

/**
 * app.fetchStatus.cartItems.deleteSingle state Slice
 **/
export type deleteSingleCartItemFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteSingleCartItemFetchStatusSlice = createSlice({
  name: "app/fetchStatus/cartItem/deleteSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteSingleCartItemFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteSingleCartItemFetchStatusSliceReducer = deleteSingleCartItemFetchStatusSlice.reducer
export const deleteSingleCartItemFetchStatusActions = deleteSingleCartItemFetchStatusSlice.actions

/**
 * app.fetchStatus.cartItems.delete state Slice
 **/
export type deleteCartItemFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteCartItemFetchStatusSlice = createSlice({
  name: "app/fetchStatus/cartItem/delete", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteCartItemFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteCartItemFetchStatusSliceReducer = deleteCartItemFetchStatusSlice.reducer
export const deleteCartItemFetchStatusActions = deleteCartItemFetchStatusSlice.actions

