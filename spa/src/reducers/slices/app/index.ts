import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestTrackerType, AuthType, UserTypeEnum, FetchStatusEnum } from "src/app";
import { defaultUser } from "domain/user/types";

/**
 * common reducer action type
 *   - call multiple reducers on different properties
 **/

// cancel all sort & filter
export const clearAllSortAndFilterActionCreator = createAction("/app/common/clearAllSortAndFilter")
export const clearAllSortAndFilterActionTypeName = clearAllSortAndFilterActionCreator().type

/**
 * app.auth state Slice
 **/
export type authUpdateActionType = PayloadAction<AuthType>

export const authSlice = createSlice({
  name: "app/auth", // a name used in action type
  initialState: {
    isLoggedIn: false,
    userType: UserTypeEnum.GUEST
  } as AuthType,
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
    login: (state: AuthType, action: authUpdateActionType) => action.payload,
    update: (state: AuthType, action: authUpdateActionType) => action.payload,
    logout: (state: AuthType) => ({
      isLoggedIn: false,
      userType: UserTypeEnum.GUEST,
      user: defaultUser
    }),

  }
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
  //extraReducers: (builder) => {
  //  builder.addCase(
  //    clearAllSortAndFilterActionCreator,
  //    (state: string) => ""
  //  )
  //}
})

export const authSliceReducer = authSlice.reducer
export const authActions = authSlice.actions

/**
 * app.searchKeyword state Slice
 **/
export type searchKeywordUpdateActionType = PayloadAction<string>

export const searchKeywordSlice = createSlice({
  name: "app/searchKeyword", // a name used in action type
  initialState: "",
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
    update: (state: string, action: searchKeywordUpdateActionType) => action.payload,
    clear: (state: string) => "",

  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
  extraReducers: (builder) => {
    builder.addCase(
      clearAllSortAndFilterActionCreator,
      (state: string) => ""
    )
  }
})

export const searchKeywordSliceReducer = searchKeywordSlice.reducer
export const searchKeywordActions = searchKeywordSlice.actions


/**
 * app.requestTracker state Slice
 **/
export type requestTrackerUpdateActionType = PayloadAction<RequestTrackerType>

export const requestTrackerSlice = createSlice({
  name: "app/requestTracker", // a name used in action type
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
    update: (state: RequestTrackerType, action: requestTrackerUpdateActionType) => ({ ...state, ...action.payload }),
    clear: (state: RequestTrackerType) => null
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const requestTrackerSliceReducer = requestTrackerSlice.reducer
export const requestTrackerActions = requestTrackerSlice.actions
