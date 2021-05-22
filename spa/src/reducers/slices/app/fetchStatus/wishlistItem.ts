import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";

/**
 * app.fetchStatus.wishlistItem.get state Slice
 **/
export type getWishlistItemFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getWishlistItemFetchStatusSlice = createSlice({
  name: "app/fetchStatus/wishlistItem/get", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getWishlistItemFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getWishlistItemFetchStatusSliceReducer = getWishlistItemFetchStatusSlice.reducer
export const getWishlistItemFetchStatusActions = getWishlistItemFetchStatusSlice.actions

/**
 * app.fetchStatus.wishlistItem.post state Slice
 **/
export type postWishlistItemFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postWishlistItemFetchStatusSlice = createSlice({
  name: "app/fetchStatus/wishlistItem/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postWishlistItemFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postWishlistItemFetchStatusSliceReducer = postWishlistItemFetchStatusSlice.reducer
export const postWishlistItemFetchStatusActions = postWishlistItemFetchStatusSlice.actions

/**
 * app.fetchStatus.wishlistItem.patch state Slice
 **/
export type patchWishlistItemFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const patchWishlistItemFetchStatusSlice = createSlice({
  name: "app/fetchStatus/wishlistItem/patch", // a name used in action type
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
    update: (state: FetchStatusEnum, action: patchWishlistItemFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const patchWishlistItemFetchStatusSliceReducer = patchWishlistItemFetchStatusSlice.reducer
export const patchWishlistItemFetchStatusActions = patchWishlistItemFetchStatusSlice.actions

/**
 * app.fetchStatus.wishlistItem.deleteSingle state Slice
 **/
export type deleteSingleWishlistItemFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteSingleWishlistItemFetchStatusSlice = createSlice({
  name: "app/fetchStatus/wishlistItem/deleteSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteSingleWishlistItemFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteSingleWishlistItemFetchStatusSliceReducer = deleteSingleWishlistItemFetchStatusSlice.reducer
export const deleteSingleWishlistItemFetchStatusActions = deleteSingleWishlistItemFetchStatusSlice.actions

/**
 * app.fetchStatus.wishlistItem.delete state Slice
 **/
export type deleteWishlistItemFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteWishlistItemFetchStatusSlice = createSlice({
  name: "app/fetchStatus/wishlistItem/delete", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteWishlistItemFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteWishlistItemFetchStatusSliceReducer = deleteWishlistItemFetchStatusSlice.reducer
export const deleteWishlistItemFetchStatusActions = deleteWishlistItemFetchStatusSlice.actions

