import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";

/**
 * app.fetchStatus.product.get state Slice
 **/
export type getProductFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getProductFetchStatusSlice = createSlice({
  name: "app/fetchStatus/product/get", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getProductFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getProductFetchStatusSliceReducer = getProductFetchStatusSlice.reducer
export const getProductFetchStatusActions = getProductFetchStatusSlice.actions

/**
 * app.fetchStatus.product.getSingle state Slice
 **/
export type getSingleProductFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getSingleProductFetchStatusSlice = createSlice({
  name: "app/fetchStatus/product/getSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getSingleProductFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getSingleProductFetchStatusSliceReducer = getSingleProductFetchStatusSlice.reducer
export const getSingleProductFetchStatusActions = getSingleProductFetchStatusSlice.actions

/**
 * app.fetchStatus.product.post state Slice
 **/
export type postProductFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postProductFetchStatusSlice = createSlice({
  name: "app/fetchStatus/product/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postProductFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postProductFetchStatusSliceReducer = postProductFetchStatusSlice.reducer
export const postProductFetchStatusActions = postProductFetchStatusSlice.actions

/**
 * app.fetchStatus.product.patch state Slice
 *
 *    - to temporarly delete product request
 **/
export type patchProductFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const patchProductFetchStatusSlice = createSlice({
  name: "app/fetchStatus/product/patch", // a name used in action type
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
    update: (state: FetchStatusEnum, action: patchProductFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const patchProductFetchStatusSliceReducer = patchProductFetchStatusSlice.reducer
export const patchProductFetchStatusActions = patchProductFetchStatusSlice.actions

/**
 * app.fetchStatus.product.put state Slice
 *
 *  - update product data of the same id
 **/
export type putProductFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putProductFetchStatusSlice = createSlice({
  name: "app/fetchStatus/product/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putProductFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putProductFetchStatusSliceReducer = putProductFetchStatusSlice.reducer
export const putProductFetchStatusActions = putProductFetchStatusSlice.actions

/**
 * app.fetchStatus.product.deleteSingle state Slice
 **/
export type deleteSingleProductFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteSingleProductFetchStatusSlice = createSlice({
  name: "app/fetchStatus/product/deleteSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteSingleProductFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteSingleProductFetchStatusSliceReducer = deleteSingleProductFetchStatusSlice.reducer
export const deleteSingleProductFetchStatusActions = deleteSingleProductFetchStatusSlice.actions

/**
 * app.fetchStatus.product.delete state Slice
 **/
export type deleteProductFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteProductFetchStatusSlice = createSlice({
  name: "app/fetchStatus/product/delete", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteProductFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteProductFetchStatusSliceReducer = deleteProductFetchStatusSlice.reducer
export const deleteProductFetchStatusActions = deleteProductFetchStatusSlice.actions


/**
 * app.fetchStatus.productvariant.post state Slice
 **/
export type postProductVariantFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postProductVariantFetchStatusSlice = createSlice({
  name: "app/fetchStatus/product/variant/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postProductVariantFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postProductVariantFetchStatusSliceReducer = postProductVariantFetchStatusSlice.reducer
export const postProductVariantFetchStatusActions = postProductVariantFetchStatusSlice.actions

/**
 * app.fetchStatus.productvariant.put state Slice
 *
 *  - update productvariant data of the same id
 **/
export type putProductVariantFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putProductVariantFetchStatusSlice = createSlice({
  name: "app/fetchStatus/product/variant/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putProductVariantFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putProductVariantFetchStatusSliceReducer = putProductVariantFetchStatusSlice.reducer
export const putProductVariantFetchStatusActions = putProductVariantFetchStatusSlice.actions

/**
 * app.fetchStatus.productvariant.deleteSingle state Slice
 **/
export type deleteSingleProductVariantFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteSingleProductVariantFetchStatusSlice = createSlice({
  name: "app/fetchStatus/product/variant/deleteSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteSingleProductVariantFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteSingleProductVariantFetchStatusSliceReducer = deleteSingleProductVariantFetchStatusSlice.reducer
export const deleteSingleProductVariantFetchStatusActions = deleteSingleProductVariantFetchStatusSlice.actions

