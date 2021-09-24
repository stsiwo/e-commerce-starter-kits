import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderEventCriteria } from "domain/order/types";
import {
  AdminCompanyType,
  defaultUser,
  UserAddressCriteria,
  UserAddressType,
  UserCompanyCriteria,
  UserCriteria,
  UserPhoneCriteria,
  UserPhoneType,
  UserType,
} from "domain/user/types";
import {
  AuthType,
  MessageStateType,
  MessageTypeEnum,
  RequestTrackerType,
  UserTypeEnum,
} from "src/app";
import { getNanoId } from "src/utils";

/**
 * common reducer action type
 *   - call multiple reducers on different properties
 **/

// cancel all sort & filter
export const clearAllSortAndFilterActionCreator = createAction(
  "/app/common/clearAllSortAndFilter"
);
export const clearAllSortAndFilterActionTypeName =
  clearAllSortAndFilterActionCreator().type;

// for PUT (replace) request
export declare type PutAuthActionType = UserCriteria;
export const putAuthActionCreator = createAction<PutAuthActionType>(
  "saga/domain/auth/put"
);
export const putAuthActionTypeName = putAuthActionCreator().type;

// for POST (create a phone) request
export declare type PostAuthPhoneActionType = UserPhoneCriteria;
export const postAuthPhoneActionCreator = createAction<PostAuthPhoneActionType>(
  "saga/domain/auth/phone/post"
);
export const postAuthPhoneActionTypeName = postAuthPhoneActionCreator().type;

// for PUT (replace a phone) request
export declare type PutAuthPhoneActionType = UserPhoneCriteria;
export const putAuthPhoneActionCreator = createAction<PutAuthPhoneActionType>(
  "saga/domain/auth/phone/put"
);
export const putAuthPhoneActionTypeName = putAuthPhoneActionCreator().type;

// for PATCH (replace a phone) request
export declare type PatchAuthPhoneActionType = {
  phoneId: string;
  version: number;
};
export const patchAuthPhoneActionCreator =
  createAction<PatchAuthPhoneActionType>("saga/domain/auth/phone/patch");
export const patchAuthPhoneActionTypeName = patchAuthPhoneActionCreator().type;

// for DELETE (delete a phone) request
export declare type DeleteAuthPhoneActionType = {
  phoneId: string;
  version: number;
};
export const deleteAuthPhoneActionCreator =
  createAction<DeleteAuthPhoneActionType>("saga/domain/auth/phone/delete");
export const deleteAuthPhoneActionTypeName =
  deleteAuthPhoneActionCreator().type;

// for POST (create a address) request
export declare type PostAuthAddressActionType = UserAddressCriteria;
export const postAuthAddressActionCreator =
  createAction<PostAuthAddressActionType>("saga/domain/auth/address/post");
export const postAuthAddressActionTypeName =
  postAuthAddressActionCreator().type;

// for PUT (replace a address) request
export declare type PutAuthAddressActionType = UserAddressCriteria;
export const putAuthAddressActionCreator =
  createAction<PutAuthAddressActionType>("saga/domain/auth/address/put");
export const putAuthAddressActionTypeName = putAuthAddressActionCreator().type;

// for PATCH (replace a address) request
export declare type PatchAuthAddressActionType = {
  addressId: string;
  type: string;
  version: number;
}; // 'billing'/'shipping'
export const patchAuthAddressActionCreator =
  createAction<PatchAuthAddressActionType>("saga/domain/auth/address/patch");
export const patchAuthAddressActionTypeName =
  patchAuthAddressActionCreator().type;

// for DELETE (delete a address) request
export declare type DeleteAuthAddressActionType = {
  addressId: string;
  version: number;
};
export const deleteAuthAddressActionCreator =
  createAction<DeleteAuthAddressActionType>("saga/domain/auth/address/delete");
export const deleteAuthAddressActionTypeName =
  deleteAuthAddressActionCreator().type;

// for POST (avatar-image) request
export declare type PostAuthAvatarImageActionType = {
  avatarImage: File;
  userId: string;
  version: number;
};
export const postAuthAvatarImageActionCreator =
  createAction<PostAuthAvatarImageActionType>(
    "saga/domain/auth/avatar-image/post"
  );
export const postAuthAvatarImageActionTypeName =
  postAuthAvatarImageActionCreator().type;

// for DELETE (avatar-image) request
export declare type DeleteAuthAvatarImageActionType = {
  userId: string;
  version: number;
};

export const deleteAuthAvatarImageActionCreator =
  createAction<DeleteAuthAvatarImageActionType>(
    "saga/domain/auth/avatar-image/delete"
  );
export const deleteAuthAvatarImageActionTypeName =
  deleteAuthAvatarImageActionCreator().type;

// for PUT (replace a company) request
export declare type PutAuthCompanyActionType = UserCompanyCriteria;
export const putAuthCompanyActionCreator =
  createAction<PutAuthCompanyActionType>("saga/domain/auth/company/put");
export const putAuthCompanyActionTypeName = putAuthCompanyActionCreator().type;

// for GET (fetch auth order) request
export declare type FetchAuthOrderActionType = { userId: string };
export const fetchAuthOrderActionCreator =
  createAction<FetchAuthOrderActionType>("saga/domain/auth/order/fetch");
export const fetchAuthOrderActionTypeName = fetchAuthOrderActionCreator().type;

// for GET (fetch single auth order) request
export declare type FetchSingleAuthOrderActionType = {
  userId: string;
  orderId: string;
};
export const fetchSingleAuthOrderActionCreator =
  createAction<FetchSingleAuthOrderActionType>(
    "saga/domain/auth/order/fetchSingle"
  );
export const fetchSingleAuthOrderActionTypeName =
  fetchSingleAuthOrderActionCreator().type;

// for POST (post auth order event) request
export declare type PostAuthOrderEventActionType = OrderEventCriteria & {
  orderId: string;
  orderVersion: number;
};
export const postAuthOrderEventActionCreator =
  createAction<PostAuthOrderEventActionType>(
    "saga/domain/auth/order/event/post"
  );
export const postAuthOrderEventActionTypeName =
  postAuthOrderEventActionCreator().type;

/**
 * app.auth state Slice
 **/
export type authUpdateActionType = PayloadAction<AuthType>;

export const authSlice = createSlice({
  name: "app/auth", // a name used in action type
  initialState: {
    isLoggedIn: false,
    userType: UserTypeEnum.GUEST,
    user: defaultUser,
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
    loginWithUser: (state: AuthType, action: PayloadAction<UserType>) => {
      return {
        isLoggedIn: true,
        userType: action.payload.userType.userType,
        user: action.payload,
      };
    },
    updateUser: (state: AuthType, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      return state;
    },
    update: (state: AuthType, action: authUpdateActionType) => action.payload,
    logout: (state: AuthType) => {
      /**
       * make this conditional for the sake of setTimeout with logout.
       *
       * make a user who already logout logout might cause bugs/unexpected error.
       */
      if (state.isLoggedIn) {
        return {
          isLoggedIn: false,
          userType: UserTypeEnum.GUEST,
          user: defaultUser,
        };
      } else {
        // if this user is logout already, no-op
        return state;
      }
    },
    updateAvatarImagePath: (state: AuthType, action: PayloadAction<string>) => {
      state.user.avatarImagePath = action.payload;
      return state;
    },

    switchPrimaryPhone: (
      state: AuthType,
      action: PayloadAction<{ phoneId: string }>
    ) => {
      state.user.phones = state.user.phones.map((phone: UserPhoneType) => {
        if (phone.phoneId == action.payload.phoneId) {
          phone.isSelected = true;
        } else {
          phone.isSelected = false;
        }
        return phone;
      });
      return state;
    },

    replacePhone: (state: AuthType, action: PayloadAction<UserPhoneType[]>) => {
      state.user.phones = action.payload;
      return state;
    },

    appendPhone: (state: AuthType, action: PayloadAction<UserPhoneType>) => {
      state.user.phones.push(action.payload);
      return state;
    },

    updatePhone: (state: AuthType, action: PayloadAction<UserPhoneType>) => {
      state.user.phones = state.user.phones.map((phone: UserPhoneType) => {
        if (phone.phoneId == action.payload.phoneId) {
          return action.payload;
        }
        return phone;
      });
      return state;
    },

    deletePhone: (
      state: AuthType,
      action: PayloadAction<{ phoneId: string }>
    ) => {
      state.user.phones = state.user.phones.filter(
        (phone: UserPhoneType) => phone.phoneId != action.payload.phoneId
      );
      return state;
    },

    switchShippingAddress: (
      state: AuthType,
      action: PayloadAction<{ addressId: string }>
    ) => {
      state.user.addresses = state.user.addresses.map(
        (address: UserAddressType) => {
          if (address.addressId == action.payload.addressId) {
            address.isShippingAddress = true;
          } else {
            address.isShippingAddress = false;
          }
          return address;
        }
      );
      return state;
    },

    switchBillingAddress: (
      state: AuthType,
      action: PayloadAction<{ addressId: string }>
    ) => {
      state.user.addresses = state.user.addresses.map(
        (address: UserAddressType) => {
          if (address.addressId == action.payload.addressId) {
            address.isBillingAddress = true;
          } else {
            address.isBillingAddress = false;
          }
          return address;
        }
      );
      return state;
    },

    replaceAddress: (
      state: AuthType,
      action: PayloadAction<UserAddressType[]>
    ) => {
      state.user.addresses = action.payload;
      return state;
    },

    appendAddress: (
      state: AuthType,
      action: PayloadAction<UserAddressType>
    ) => {
      state.user.addresses.push(action.payload);
      return state;
    },

    updateAddress: (
      state: AuthType,
      action: PayloadAction<UserAddressType>
    ) => {
      state.user.addresses = state.user.addresses.map(
        (address: UserAddressType) => {
          if (address.addressId == action.payload.addressId) {
            return action.payload;
          }
          return address;
        }
      );
      return state;
    },

    deleteAddress: (
      state: AuthType,
      action: PayloadAction<{ addressId: string }>
    ) => {
      state.user.addresses = state.user.addresses.filter(
        (address: UserAddressType) =>
          address.addressId != action.payload.addressId
      );
      return state;
    },

    updateCompany: (
      state: AuthType,
      action: PayloadAction<AdminCompanyType>
    ) => {
      state.user.companies = state.user.companies.map(
        (company: AdminCompanyType) => {
          if (company.companyId == action.payload.companyId) {
            return action.payload;
          }
          return company;
        }
      );
      return state;
    },
  },
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
});

export const authSliceReducer = authSlice.reducer;
export const authActions = authSlice.actions;

/**
 * app.previousUrl state Slice
 **/
export type previousUrlUpdateActionType = PayloadAction<string>;

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
    update: (state: string, action: previousUrlUpdateActionType) =>
      action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
  extraReducers: (builder) => {
    builder.addCase(clearAllSortAndFilterActionCreator, (state: string) => "");
  },
});

export const previousUrlSliceReducer = previousUrlSlice.reducer;
export const previousUrlActions = previousUrlSlice.actions;

/**
 * app.message state Slice
 **/
export type MessageActionType = PayloadAction<MessageStateType>;

export const messageSlice = createSlice({
  name: "app/message", // a name used in action type
  initialState: {
    id: getNanoId(),
    type: MessageTypeEnum.INITIAL,
    message: "",
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
    update: (state: MessageStateType, action: MessageActionType) =>
      action.payload,
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
});

export const messageSliceReducer = messageSlice.reducer;
export const messageActions = messageSlice.actions;

/**
 * app.searchKeyword state Slice
 **/
export type searchKeywordUpdateActionType = PayloadAction<string>;

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
    update: (state: string, action: searchKeywordUpdateActionType) =>
      action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
  extraReducers: (builder) => {
    builder.addCase(clearAllSortAndFilterActionCreator, (state: string) => "");
  },
});

export const searchKeywordSliceReducer = searchKeywordSlice.reducer;
export const searchKeywordActions = searchKeywordSlice.actions;

/**
 * app.requestTracker state Slice
 **/
export type requestTrackerUpdateActionType = PayloadAction<RequestTrackerType>;

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
    update: (
      state: RequestTrackerType,
      action: requestTrackerUpdateActionType
    ) => ({ ...state, ...action.payload }),
    clear: (state: RequestTrackerType) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
});

export const requestTrackerSliceReducer = requestTrackerSlice.reducer;
export const requestTrackerActions = requestTrackerSlice.actions;
