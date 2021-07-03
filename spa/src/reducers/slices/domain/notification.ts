import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType } from "domain/notification/types";
import { DomainPaginationType } from "states/types";

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request with cache
export declare type FetchNotificationActionType = { type: string } // 'replace'/'concat' 
export const fetchNotificationActionCreator = createAction<FetchNotificationActionType>("saga/domain/notification/fetch")
export const fetchNotificationActionTypeName = fetchNotificationActionCreator().type

// for PUT (add a new cart item) request
export declare type PatchNotificationActionType = { notificationId: string, userId: string }
export const patchNotificationActionCreator = createAction<PatchNotificationActionType>("saga/domain/notification/patch")
export const patchNotificationActionTypeName = patchNotificationActionCreator().type

// validate curIndex increment
export const incrementNotificationCurIndexActionCreator = createAction("saga/domain/notification/curIndex/increment")
export const incrementNotificationCurIndexActionTypeName = incrementNotificationCurIndexActionCreator().type

/**
 *
 * domain.notifications.data state Slice (no side effects)
 *
 **/
// action type             
export type NotificationActionType = PayloadAction<NotificationType[]>

export const notificationSlice = createSlice({
  name: "domain/notification/data", // a name used in action type
  initialState: [],
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

    concat: (state: NotificationType[], action: NotificationActionType) => state.concat(action.payload),

    // replace
    update: (state: NotificationType[], action: NotificationActionType) => action.payload,

    // update a single domain
    updateOne: (state: NotificationType[], action: PayloadAction<NotificationType>) => {
      return state.map((domain: NotificationType) => {
        if (domain.notificationId === action.payload.notificationId) {
          return action.payload
        }
        return domain
      })
    },

    clear: (state: NotificationType[]) => [],
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
})

export const notificationSliceReducer = notificationSlice.reducer
export const notificationActions = notificationSlice.actions


/**
 *
 * domain.notifications.pagination state Slice (no side effects).
 *
 * you CANNOT use this since you register reducers for each property (not as whole object)
 *
 **/
// action type             
export type NotificationPaginationActionType = PayloadAction<DomainPaginationType>

export const notificationPaginationSlice = createSlice({
  name: "domain/notifications/pagination", // a name used in action type
  initialState: {
    page: 0,
    limit: 5,
    totalPages: 1,
    totalElements: 0,
  },
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

    // use when you want to replace
    update: (state: DomainPaginationType, action: NotificationPaginationActionType) => {
      return action.payload
    },
    incrementPage: (state: DomainPaginationType) => {
      state.page = state.page + 1
      return state
    },
    clear: (state: DomainPaginationType) => ({
      page: 0,
      limit: 5,
      totalPages: 1,
      totalElements: 0,
    }),
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
})

export const notificationPaginationSliceReducer = notificationPaginationSlice.reducer
export const notificationPaginationActions = notificationPaginationSlice.actions


/**
 *
 * domain.notifications.curIndex state Slice (no side effects)
 *
 **/
// action type             
export type NotificationCurIndexActionType = PayloadAction<number>

export const notificationCurIndexSlice = createSlice({
  name: "domain/notifications/curIndex", // a name used in action type
  initialState: -1,
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

    // use when you want to replace
    update: (state: number, action: NotificationCurIndexActionType) => action.payload,
    increment: (state: number) => state + 1,
    decrement: (state: number) => state - 1,
    clear: (state: number) => -1,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
})

export const notificationCurIndexSliceReducer = notificationCurIndexSlice.reducer
export const notificationCurIndexActions = notificationCurIndexSlice.actions

