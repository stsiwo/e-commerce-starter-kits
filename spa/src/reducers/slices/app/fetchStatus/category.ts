import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";

/**
 * app.fetchStatus.category.get state Slice
 **/
export type getCategoryFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getCategoryFetchStatusSlice = createSlice({
  name: "app/fetchStatus/category/get", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getCategoryFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getCategoryFetchStatusSliceReducer = getCategoryFetchStatusSlice.reducer
export const getCategoryFetchStatusActions = getCategoryFetchStatusSlice.actions

/**
 * app.fetchStatus.category.post state Slice
 **/
export type postCategoryFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postCategoryFetchStatusSlice = createSlice({
  name: "app/fetchStatus/category/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postCategoryFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postCategoryFetchStatusSliceReducer = postCategoryFetchStatusSlice.reducer
export const postCategoryFetchStatusActions = postCategoryFetchStatusSlice.actions

/**
 * app.fetchStatus.category.put state Slice
 **/
export type putCategoryFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putCategoryFetchStatusSlice = createSlice({
  name: "app/fetchStatus/category/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putCategoryFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putCategoryFetchStatusSliceReducer = putCategoryFetchStatusSlice.reducer
export const putCategoryFetchStatusActions = putCategoryFetchStatusSlice.actions

/**
 * app.fetchStatus.category.deleteSingle state Slice
 **/
export type deleteSingleCategoryFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteSingleCategoryFetchStatusSlice = createSlice({
  name: "app/fetchStatus/category/deleteSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteSingleCategoryFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteSingleCategoryFetchStatusSliceReducer = deleteSingleCategoryFetchStatusSlice.reducer
export const deleteSingleCategoryFetchStatusActions = deleteSingleCategoryFetchStatusSlice.actions

/**
 * app.fetchStatus.category.delete state Slice
 **/
export type deleteCategoryFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteCategoryFetchStatusSlice = createSlice({
  name: "app/fetchStatus/category/delete", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteCategoryFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

