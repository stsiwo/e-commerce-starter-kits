import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestTrackerType, AuthType, UserTypeEnum, FetchStatusEnum, MessageStateType, MessageTypeEnum } from "src/app";
import { defaultUser, UserPhoneType, UserAddressType, UserType } from "domain/user/types";
import { getNanoId } from "src/utils";

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
    loginWithUser: (state: AuthType,  action: PayloadAction<UserType>) => {
      return {
        isLoggedIn: true,
        userType: action.payload.userType.userType,
        user: action.payload,
      }
    },
    update: (state: AuthType, action: authUpdateActionType) => action.payload,
    logout: (state: AuthType) => ({
      isLoggedIn: false,
      userType: UserTypeEnum.GUEST,
      user: defaultUser
    }),

    switchPrimaryPhone: (state: AuthType, action: PayloadAction<UserPhoneType>) => {
      state.user.phones = state.user.phones.map((phone: UserPhoneType) => {
        if (phone.phoneId == action.payload.phoneId) {
          phone.isSelected = true
        } else {
          phone.isSelected = false
        }
        return phone
      })
      return state
    },


    appendPhone: (state: AuthType, action: PayloadAction<UserPhoneType>) => {
      state.user.phones.push(action.payload)
      return state
    },

    updatePhone: (state: AuthType, action: PayloadAction<UserPhoneType>) => {
      state.user.phones = state.user.phones.map((phone: UserPhoneType) => {
        if (phone.phoneId == action.payload.phoneId) {
          return action.payload
        }
        return phone
      })
      return state
    },

    deletePhone: (state: AuthType, action: PayloadAction<{ phoneId: string }>) => {
      state.user.phones = state.user.phones.filter((phone: UserPhoneType) => phone.phoneId != action.payload.phoneId)
      return state
    },

    switchShippingAddress: (state: AuthType, action: PayloadAction<UserAddressType>) => {
      state.user.addresses = state.user.addresses.map((address: UserAddressType) => {
        if (address.addressId == action.payload.addressId) {
          address.isShippingAddress = true
        } else {
          address.isShippingAddress = false
        }
        return address
      })
      return state
    },

    switchBillingAddress: (state: AuthType, action: PayloadAction<UserAddressType>) => {
      state.user.addresses = state.user.addresses.map((address: UserAddressType) => {
        if (address.addressId == action.payload.addressId) {
          address.isBillingAddress = true
        } else {
          address.isBillingAddress = false
        }
        return address
      })
      return state
    },

    appendAddress: (state: AuthType, action: PayloadAction<UserAddressType>) => {
      state.user.addresses.push(action.payload)
      return state
    },

    updateAddress: (state: AuthType, action: PayloadAction<UserAddressType>) => {
      state.user.addresses = state.user.addresses.map((address: UserAddressType) => {
        if (address.addressId == action.payload.addressId) {
          return action.payload
        }
        return address
      })
      return state
    },

    deleteAddress: (state: AuthType, action: PayloadAction<{ addressId: string }>) => {
      state.user.addresses = state.user.addresses.filter((address: UserAddressType) => address.addressId != action.payload.addressId)
      return state
    },
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
 * app.previousUrl state Slice
 **/
export type previousUrlUpdateActionType = PayloadAction<string>

export const previousUrlSlice = createSlice({
  name: "app/previousUrl", // a name used in action type
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
    update: (state: string, action: previousUrlUpdateActionType) => action.payload,
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

export const previousUrlSliceReducer = previousUrlSlice.reducer
export const previousUrlActions = previousUrlSlice.actions


/**
 * app.message state Slice
 **/
export type MessageActionType = PayloadAction<MessageStateType>

export const messageSlice = createSlice({
  name: "app/message", // a name used in action type
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
    update: (state: MessageStateType, action: MessageActionType) => action.payload,
    clear: (state: MessageStateType) => ({
      id: getNanoId(),
      type: MessageTypeEnum.INITIAL,
      message: "",
    }),

  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const messageSliceReducer = messageSlice.reducer
export const messageActions = messageSlice.actions



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
