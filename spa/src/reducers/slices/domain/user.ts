import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UserActiveEnum,
  UserAddressCriteria,
  UserAddressType,
  UserCriteria,
  UserPhoneCriteria,
  UserPhoneType,
  UserSortEnum,
  UserType,
} from "domain/user/types";
import remove from "lodash/remove";

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request
export const fetchUserActionCreator = createAction("saga/domain/user/fetch");
export const fetchUserActionTypeName = fetchUserActionCreator().type;

// for GET by Id request
export const fetchSingleUserActionCreator = createAction<{ userId: string }>(
  "saga/domain/user/fetchSingle"
);
export const fetchSingleUserActionTypeName =
  fetchSingleUserActionCreator().type;

// for POST (add a new cart item) request
export const postUserActionCreator = createAction<UserType>(
  "saga/domain/user/post"
);
export const postUserActionTypeName = postUserActionCreator().type;

// for PUT (replace) request
export declare type PutUserActionType = UserCriteria;
export const putUserActionCreator = createAction<PutUserActionType>(
  "saga/domain/user/put"
);
export const putUserActionTypeName = putUserActionCreator().type;

// for DELETE (delete single cart item) request
export const deleteSingleUserActionCreator = createAction<UserType>(
  "saga/domain/user/deleteSingle"
);
export const deleteSingleUserActionTypeName =
  deleteSingleUserActionCreator().type;

// for DELETE (delete all of cart items) request
export const deleteUserActionCreator = createAction<UserType>(
  "saga/domain/user/delete"
);
export const deleteUserActionTypeName = deleteUserActionCreator().type;

// for POST (create a phone) request
export declare type PostUserPhoneActionType = UserPhoneCriteria & {
  userId: string;
};
export const postUserPhoneActionCreator = createAction<PostUserPhoneActionType>(
  "saga/domain/user/phone/post"
);
export const postUserPhoneActionTypeName = postUserPhoneActionCreator().type;

// for PUT (replace a phone) request
export declare type PutUserPhoneActionType = UserPhoneCriteria & {
  userId: string;
};
export const putUserPhoneActionCreator = createAction<PutUserPhoneActionType>(
  "saga/domain/user/phone/put"
);
export const putUserPhoneActionTypeName = putUserPhoneActionCreator().type;

// for PATCH (replace a phone) request
export declare type PatchUserPhoneActionType = {
  phoneId: string;
  userId: string;
  version: number;
};
export const patchUserPhoneActionCreator =
  createAction<PatchUserPhoneActionType>("saga/domain/user/phone/patch");
export const patchUserPhoneActionTypeName = patchUserPhoneActionCreator().type;

// for DELETE (delete a phone) request
export declare type DeleteUserPhoneActionType = {
  phoneId: string;
  userId: string;
  version: number;
};
export const deleteUserPhoneActionCreator =
  createAction<DeleteUserPhoneActionType>("saga/domain/user/phone/delete");
export const deleteUserPhoneActionTypeName =
  deleteUserPhoneActionCreator().type;

// for POST (create a address) request
export declare type PostUserAddressActionType = UserAddressCriteria & {
  userId: string;
};
export const postUserAddressActionCreator =
  createAction<PostUserAddressActionType>("saga/domain/user/address/post");
export const postUserAddressActionTypeName =
  postUserAddressActionCreator().type;

// for PUT (replace a address) request
export declare type PutUserAddressActionType = UserAddressCriteria & {
  userId: string;
};
export const putUserAddressActionCreator =
  createAction<PutUserAddressActionType>("saga/domain/user/address/put");
export const putUserAddressActionTypeName = putUserAddressActionCreator().type;

// for PATCH (replace a address) request
export declare type PatchUserAddressActionType = {
  addressId: string;
  type: string;
  userId: string;
  version: number;
}; // 'billing'/'shipping'
export const patchUserAddressActionCreator =
  createAction<PatchUserAddressActionType>("saga/domain/user/address/patch");
export const patchUserAddressActionTypeName =
  patchUserAddressActionCreator().type;

// for DELETE (delete a address) request
export declare type DeleteUserAddressActionType = {
  addressId: string;
  userId: string;
  version: number;
};
export const deleteUserAddressActionCreator =
  createAction<DeleteUserAddressActionType>("saga/domain/user/address/delete");
export const deleteUserAddressActionTypeName =
  deleteUserAddressActionCreator().type;

// for POST (avatar-image) request
export declare type PostUserAvatarImageActionType = {
  avatarImage: File;
  userId: string;
  version: number;
};
export const postUserAvatarImageActionCreator =
  createAction<PostUserAvatarImageActionType>(
    "saga/domain/user/avatar-image/post"
  );
export const postUserAvatarImageActionTypeName =
  postUserAvatarImageActionCreator().type;

// for DELETE (avatar-image) request
export declare type DeleteUserAvatarImageActionType = {
  userId: string;
  version: number;
};
export const deleteUserAvatarImageActionCreator =
  createAction<DeleteUserAvatarImageActionType>(
    "saga/domain/user/avatar-image/delete"
  );
export const deleteUserAvatarImageActionTypeName =
  deleteUserAvatarImageActionCreator().type;

/**
 *
 * domain.users state Slice (no side effects)
 *
 **/
// action type
export type UserActionType = PayloadAction<UserType[]>;

export const userSlice = createSlice({
  name: "domain/user", // a name used in action type
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

    /**
     * be careful that duplicate might exist.
     *
     * - not unique.
     *
     **/
    // use when update existing one
    concat: (state: UserType[], action: UserActionType) => {
      return state.concat(action.payload);
    },

    // use when you want to replace
    update: (state: UserType[], action: UserActionType) => action.payload,

    // update a single user
    updateUser: (
      state: UserType[],
      action: PayloadAction<{ userId: string; user: UserType }>
    ) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].userId === action.payload.userId) {
          state[i] = action.payload.user;
        }
      }
      return state;
    },

    // use when you want to remove a single entity
    delete: (state: UserType[], action: PayloadAction<UserType>) =>
      remove(state, (user: UserType) => user.userId == action.payload.userId),

    appendPhone: (
      state: UserType[],
      action: PayloadAction<{ userId: string; phone: UserPhoneType }>
    ) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].userId === action.payload.userId) {
          state[i].phones.push(action.payload.phone);
        }
      }
      return state;
    },

    replacePhones: (
      state: UserType[],
      action: PayloadAction<{ userId: string; phones: UserPhoneType[] }>
    ) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].userId === action.payload.userId) {
          state[i].phones = action.payload.phones;
        }
      }
      return state;
    },

    updatePhone: (
      state: UserType[],
      action: PayloadAction<{ userId: string; phone: UserPhoneType }>
    ) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].userId === action.payload.userId) {
          state[i].phones = state[i].phones.map((phone: UserPhoneType) => {
            if (phone.phoneId === action.payload.phone.phoneId) {
              return action.payload.phone;
            }
            return phone;
          });
        }
      }
      return state;
    },

    removePhone: (
      state: UserType[],
      action: PayloadAction<{ userId: string; phoneId: string }>
    ) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].userId === action.payload.userId) {
          state[i].phones = state[i].phones.filter(
            (phone: UserPhoneType) => phone.phoneId != action.payload.phoneId
          );
        }
      }
      return state;
    },

    appendAddress: (
      state: UserType[],
      action: PayloadAction<{ userId: string; address: UserAddressType }>
    ) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].userId === action.payload.userId) {
          state[i].addresses.push(action.payload.address);
        }
      }
      return state;
    },

    replaceAddresses: (
      state: UserType[],
      action: PayloadAction<{ userId: string; addresses: UserAddressType[] }>
    ) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].userId === action.payload.userId) {
          state[i].addresses = action.payload.addresses;
        }
      }
      return state;
    },

    updateAddress: (
      state: UserType[],
      action: PayloadAction<{ userId: string; address: UserAddressType }>
    ) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].userId === action.payload.userId) {
          state[i].addresses = state[i].addresses.map(
            (address: UserAddressType) => {
              if (address.addressId === action.payload.address.addressId) {
                return action.payload.address;
              }
              return address;
            }
          );
        }
      }
      return state;
    },

    removeAddress: (
      state: UserType[],
      action: PayloadAction<{ userId: string; addressId: string }>
    ) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].userId === action.payload.userId) {
          state[i].addresses = state[i].addresses.filter(
            (address: UserAddressType) =>
              address.addressId != action.payload.addressId
          );
        }
      }
      return state;
    },

    clear: (state: UserType[]) => [],
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   *
   **/
});

export const userSliceReducer = userSlice.reducer;
export const userActions = userSlice.actions;

/**
 *
 * domain.users.query.searchQuery state Slice (no side effects)
 *
 **/
// action type
export type UserQuerySearchQueryActionType = PayloadAction<string>;

export const userQuerySearchQuerySlice = createSlice({
  name: "domain/users/query/searchQuery", // a name used in action type
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

    // use when you want to replace
    update: (state: string, action: UserQuerySearchQueryActionType) =>
      action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   *
   **/
});

export const userQuerySearchQuerySliceReducer =
  userQuerySearchQuerySlice.reducer;
export const userQuerySearchQueryActions = userQuerySearchQuerySlice.actions;

/**
 *
 * domain.users.query.active state Slice (no side effects)
 *
 **/
// action type
export type UserQueryActiveActionType = PayloadAction<UserActiveEnum>;

export const userQueryActiveSlice = createSlice({
  name: "domain/users/query/active", // a name used in action type
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
    update: (state: UserActiveEnum, action: UserQueryActiveActionType) =>
      action.payload,
    clear: (state: UserActiveEnum) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   *
   **/
});

export const userQueryActiveSliceReducer = userQueryActiveSlice.reducer;
export const userQueryActiveActions = userQueryActiveSlice.actions;

/**
 *
 * domain.users.query.startDate state Slice (no side effects)
 *
 **/
// action type
export type UserQueryStartDateActionType = PayloadAction<Date>;

export const userQueryStartDateSlice = createSlice({
  name: "domain/users/query/startDate", // a name used in action type
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
    update: (state: string, action: UserQueryStartDateActionType) =>
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

export const userQueryStartDateSliceReducer = userQueryStartDateSlice.reducer;
export const userQueryStartDateActions = userQueryStartDateSlice.actions;

/**
 *
 * domain.users.query.endDate state Slice (no side effects)
 *
 **/
// action type
export type UserQueryEndDateActionType = PayloadAction<Date>;

export const userQueryEndDateSlice = createSlice({
  name: "domain/users/query/endDate", // a name used in action type
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
    update: (state: string, action: UserQueryEndDateActionType) =>
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

export const userQueryEndDateSliceReducer = userQueryEndDateSlice.reducer;
export const userQueryEndDateActions = userQueryEndDateSlice.actions;

/**
 *
 * domain.users.query.sort state Slice (no side effects)
 *
 **/
// action type
export type UserQuerySortActionType = PayloadAction<UserSortEnum>;

export const userQuerySortSlice = createSlice({
  name: "domain/users/query/sort", // a name used in action type
  initialState: UserSortEnum.DATE_DESC,
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
    update: (state: string, action: UserQuerySortActionType) => action.payload,
    clear: (state: string) => UserSortEnum.DATE_DESC,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   *
   **/
});

export const userQuerySortSliceReducer = userQuerySortSlice.reducer;
export const userQuerySortActions = userQuerySortSlice.actions;

const resetPaginationExtraReducerActions = [
  userQueryActiveActions.clear,
  userQueryActiveActions.update,
  userQueryEndDateActions.clear,
  userQueryEndDateActions.update,
  userQuerySearchQueryActions.clear,
  userQuerySearchQueryActions.update,
  userQuerySortActions.clear,
  userQuerySortActions.update,
  userQueryStartDateActions.clear,
  userQueryStartDateActions.update,
];

const resetPaginationExtraReducerGenerator = (
  builder: any,
  reducer: (state: any) => any
): void => {
  /**
   * if filter action is dispatched, need to clear all pagiantion
   */
  resetPaginationExtraReducerActions.forEach((action: any) => {
    builder.addCase(action, reducer);
  });
};

/**
 *
 * domain.users.pagination.page state Slice (no side effects)
 *
 **/
// action type
export type UserPaginationPageActionType = PayloadAction<number>;

export const userPaginationPageSlice = createSlice({
  name: "domain/users/pagination/page", // a name used in action type
  initialState: 0,
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
    update: (state: number, action: UserPaginationPageActionType) =>
      action.payload,
    clear: (state: number) => 0, // start from 0, (not 1)
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   *
   **/
  extraReducers: (builder) => {
    resetPaginationExtraReducerGenerator(builder, (state: number) => 0);
  },
});

export const userPaginationPageSliceReducer = userPaginationPageSlice.reducer;
export const userPaginationPageActions = userPaginationPageSlice.actions;

/**
 *
 * domain.users.pagination.limit state Slice (no side effects)
 *
 **/
// action type
export type UserPaginationLimitActionType = PayloadAction<number>;

export const userPaginationLimitSlice = createSlice({
  name: "domain/users/pagination/limit", // a name used in action type
  initialState: 20,
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
    update: (state: number, action: UserPaginationLimitActionType) =>
      action.payload,
    clear: (state: number) => 20,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   *
   **/
  extraReducers: (builder) => {
    resetPaginationExtraReducerGenerator(builder, (state: number) => 20);
  },
});

export const userPaginationLimitSliceReducer = userPaginationLimitSlice.reducer;
export const userPaginationLimitActions = userPaginationLimitSlice.actions;

/**
 *
 * domain.users.pagination.totalPages state Slice (no side effects)
 *
 **/
// action type
export type UserPaginationTotalPagesActionType = PayloadAction<number>;

export const userPaginationTotalPagesSlice = createSlice({
  name: "domain/users/pagination/totalPages", // a name used in action type
  initialState: 1,
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
    update: (state: number, action: UserPaginationTotalPagesActionType) =>
      action.payload,
    clear: (state: number) => 1,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   *
   **/
  extraReducers: (builder) => {
    resetPaginationExtraReducerGenerator(builder, (state: number) => 1);
  },
});

export const userPaginationTotalPagesSliceReducer =
  userPaginationTotalPagesSlice.reducer;
export const userPaginationTotalPagesActions =
  userPaginationTotalPagesSlice.actions;

/**
 *
 * domain.users.pagination.totalElements state Slice (no side effects)
 *
 **/
// action type
export type UserPaginationTotalElementsActionType = PayloadAction<number>;

export const userPaginationTotalElementsSlice = createSlice({
  name: "domain/users/pagination/totalElements", // a name used in action type
  initialState: 0,
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
    update: (state: number, action: UserPaginationTotalElementsActionType) =>
      action.payload,
    clear: (state: number) => 0,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   *
   **/
  extraReducers: (builder) => {
    resetPaginationExtraReducerGenerator(builder, (state: number) => 0);
  },
});

export const userPaginationTotalElementsSliceReducer =
  userPaginationTotalElementsSlice.reducer;
export const userPaginationTotalElementsActions =
  userPaginationTotalElementsSlice.actions;
