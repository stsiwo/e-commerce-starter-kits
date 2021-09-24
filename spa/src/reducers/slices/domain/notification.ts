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
export declare type FetchNotificationActionType = { type: string }; // 'replace'/'concat'
export const fetchNotificationActionCreator =
  createAction<FetchNotificationActionType>("saga/domain/notification/fetch");
export const fetchNotificationActionTypeName =
  fetchNotificationActionCreator().type;

// for PUT (add a new cart item) request
export declare type PatchNotificationActionType = {
  notificationId: string;
  userId: string;
};
export const patchNotificationActionCreator =
  createAction<PatchNotificationActionType>("saga/domain/notification/patch");
export const patchNotificationActionTypeName =
  patchNotificationActionCreator().type;

// validate curIndex increment
export const incrementNotificationCurIndexActionCreator = createAction(
  "saga/domain/notification/curIndex/increment"
);
export const incrementNotificationCurIndexActionTypeName =
  incrementNotificationCurIndexActionCreator().type;

/**
 *
 * domain.notifications.data state Slice (no side effects)
 *
 **/
// action type
export type NotificationActionType = PayloadAction<NotificationType[]>;

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

    concat: (state: NotificationType[], action: NotificationActionType) =>
      state.concat(action.payload),

    // replace
    update: (state: NotificationType[], action: NotificationActionType) =>
      action.payload,

    // update a single domain
    updateOne: (
      state: NotificationType[],
      action: PayloadAction<NotificationType>
    ) => {
      return state.map((domain: NotificationType) => {
        if (domain.notificationId === action.payload.notificationId) {
          return action.payload;
        }
        return domain;
      });
    },

    removeOne: (state: NotificationType[], action: PayloadAction<string>) => {
      return state.filter(
        (notification: NotificationType) =>
          notification.notificationId != action.payload
      );
    },

    clear: (state: NotificationType[]) => [],
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   *
   **/
});

export const notificationSliceReducer = notificationSlice.reducer;
export const notificationActions = notificationSlice.actions;

/**
 *
 * domain.notifications.pagination state Slice (no side effects).
 *
 * you CANNOT use this since you register reducers for each property (not as whole object)
 *
 **/
// action type
export type NotificationPaginationActionType =
  PayloadAction<DomainPaginationType>;

export const notificationPaginationSlice = createSlice({
  name: "domain/notifications/pagination", // a name used in action type
  initialState: {
    last: true,
    page: 0,
    limit: 5,
    totalPages: 1,
    totalElements: 0,
  } as DomainPaginationType,
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
    update: (
      state: DomainPaginationType,
      action: NotificationPaginationActionType
    ) => {
      return action.payload;
    },
    incrementPage: (state: DomainPaginationType) => {
      state.page = state.page + 1;
      return state;
    },
    clear: (state: DomainPaginationType) => ({
      last: true,
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
});

export const notificationPaginationSliceReducer =
  notificationPaginationSlice.reducer;
export const notificationPaginationActions =
  notificationPaginationSlice.actions;

/**
 *
 * domain.notifications.curIndex state Slice (no side effects)
 *
 **/
// action type
export type NotificationCurIdActionType = PayloadAction<string>;

export const notificationCurIdSlice = createSlice({
  name: "domain/notifications/curId", // a name used in action type
  initialState: null,
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
    update: (state: string, action: NotificationCurIdActionType) =>
      action.payload,
    clear: (state: string) => -1,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   *
   **/
});

export const notificationCurIdSliceReducer = notificationCurIdSlice.reducer;
export const notificationCurIdActions = notificationCurIdSlice.actions;

/**
 *
 * domain.notifications.curIndex state Slice (no side effects)
 *
 **/
// action type
export type NotificationCurNotificationActionType =
  PayloadAction<NotificationType>;

export const notificationCurNotificationSlice = createSlice({
  name: "domain/notifications/curNotification", // a name used in action type
  initialState: null,
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
    update: (state: string, action: NotificationCurNotificationActionType) =>
      action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   *
   **/
});

export const notificationCurNotificationSliceReducer =
  notificationCurNotificationSlice.reducer;
export const notificationCurNotificationActions =
  notificationCurNotificationSlice.actions;
