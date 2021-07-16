import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";
import { resetCheckoutStateActionTypeName } from "reducers/slices/common";

/**
 * app.fetchStatus.order.get state Slice
 **/
export type getOrderFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getOrderFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/get", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getOrderFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getOrderFetchStatusSliceReducer = getOrderFetchStatusSlice.reducer
export const getOrderFetchStatusActions = getOrderFetchStatusSlice.actions

/**
 * app.fetchStatus.order.getSingle state Slice
 **/
export type getSingleOrderFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getSingleOrderFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/getSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getSingleOrderFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getSingleOrderFetchStatusSliceReducer = getSingleOrderFetchStatusSlice.reducer
export const getSingleOrderFetchStatusActions = getSingleOrderFetchStatusSlice.actions

/**
 * app.fetchStatus.order.post state Slice
 **/
export type postOrderFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postOrderFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postOrderFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
  extraReducers: {
    [resetCheckoutStateActionTypeName]: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
})

export const postOrderFetchStatusSliceReducer = postOrderFetchStatusSlice.reducer
export const postOrderFetchStatusActions = postOrderFetchStatusSlice.actions

/**
 * app.fetchStatus.order.patch state Slice
 *
 *    - to temporarly delete order request
 **/
export type patchOrderFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const patchOrderFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/patch", // a name used in action type
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
    update: (state: FetchStatusEnum, action: patchOrderFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const patchOrderFetchStatusSliceReducer = patchOrderFetchStatusSlice.reducer
export const patchOrderFetchStatusActions = patchOrderFetchStatusSlice.actions

/**
 * app.fetchStatus.order.put state Slice
 *
 *  - update order data of the same id
 **/
export type putOrderFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putOrderFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putOrderFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putOrderFetchStatusSliceReducer = putOrderFetchStatusSlice.reducer
export const putOrderFetchStatusActions = putOrderFetchStatusSlice.actions

/**
 * app.fetchStatus.order.deleteSingle state Slice
 **/
export type deleteSingleOrderFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteSingleOrderFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/deleteSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteSingleOrderFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteSingleOrderFetchStatusSliceReducer = deleteSingleOrderFetchStatusSlice.reducer
export const deleteSingleOrderFetchStatusActions = deleteSingleOrderFetchStatusSlice.actions

/**
 * app.fetchStatus.order.delete state Slice
 **/
export type deleteOrderFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteOrderFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/delete", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteOrderFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteOrderFetchStatusSliceReducer = deleteOrderFetchStatusSlice.reducer
export const deleteOrderFetchStatusActions = deleteOrderFetchStatusSlice.actions



/**
 * app.fetchStatus.orderEvent.post state Slice
 **/
export type postOrderEventFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postOrderEventFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/event/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postOrderEventFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postOrderEventFetchStatusSliceReducer = postOrderEventFetchStatusSlice.reducer
export const postOrderEventFetchStatusActions = postOrderEventFetchStatusSlice.actions

/**
 * app.fetchStatus.orderEvent.put state Slice
 *
 *  - update orderEvent data of the same id
 **/
export type putOrderEventFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putOrderEventFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/event/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putOrderEventFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putOrderEventFetchStatusSliceReducer = putOrderEventFetchStatusSlice.reducer
export const putOrderEventFetchStatusActions = putOrderEventFetchStatusSlice.actions

/**
 * app.fetchStatus.orderEvent.deleteSingle state Slice
 **/
export type deleteSingleOrderEventFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteSingleOrderEventFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/event/deleteSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteSingleOrderEventFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteSingleOrderEventFetchStatusSliceReducer = deleteSingleOrderEventFetchStatusSlice.reducer
export const deleteSingleOrderEventFetchStatusActions = deleteSingleOrderEventFetchStatusSlice.actions

/**
 * app.fetchStatus.orderEvent.post state Slice
 **/
export type postSessionTimeoutOrderEventFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postSessionTimeoutOrderEventFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/event/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postSessionTimeoutOrderEventFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postSessionTimeoutOrderEventFetchStatusSliceReducer = postSessionTimeoutOrderEventFetchStatusSlice.reducer
export const postSessionTimeoutOrderEventFetchStatusActions = postSessionTimeoutOrderEventFetchStatusSlice.actions


/**
 * app.fetchStatus.order.getRating state Slice
 **/
export type getRatingOrderFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getRatingOrderFetchStatusSlice = createSlice({
  name: "app/fetchStatus/order/getRating", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getRatingOrderFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getRatingOrderFetchStatusSliceReducer = getRatingOrderFetchStatusSlice.reducer
export const getRatingOrderFetchStatusActions = getRatingOrderFetchStatusSlice.actions