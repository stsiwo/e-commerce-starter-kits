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


/**
 * app.categoryFetchStatus state Slice
 **/
export type categoryFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const categoryFetchStatusSlice = createSlice({
  name: "app/categoryFetchStatus", // a name used in action type
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
    update: (state: FetchStatusEnum, action: categoryFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const categoryFetchStatusSliceReducer = categoryFetchStatusSlice.reducer
export const categoryFetchStatusActions = categoryFetchStatusSlice.actions

/**
 * app.fetchStatus.cartItems.get state Slice
 **/
export type getCartItemFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getCartItemFetchStatusSlice = createSlice({
  name: "app/fetchStatus/cartItem/get", // a name used in action type
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
