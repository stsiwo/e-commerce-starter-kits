import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";

/**
 * app.fetchStatus.notification.get state Slice
 **/
export type getNotificationFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getNotificationFetchStatusSlice = createSlice({
  name: "app/fetchStatus/notification/get", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getNotificationFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getNotificationFetchStatusSliceReducer = getNotificationFetchStatusSlice.reducer
export const getNotificationFetchStatusActions = getNotificationFetchStatusSlice.actions

/**
 * app.fetchStatus.notification.put state Slice
 *
 *  - update notification data of the same id
 **/
export type patchNotificationFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const patchNotificationFetchStatusSlice = createSlice({
  name: "app/fetchStatus/notification/patch", // a name used in action type
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
    update: (state: FetchStatusEnum, action: patchNotificationFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const patchNotificationFetchStatusSliceReducer = patchNotificationFetchStatusSlice.reducer
export const patchNotificationFetchStatusActions = patchNotificationFetchStatusSlice.actions

