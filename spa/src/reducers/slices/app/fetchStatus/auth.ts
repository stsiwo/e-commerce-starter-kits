import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";

/**
 * app.fetchStatus.auth.getSingle state Slice
 **/
export type getSingleAuthFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getSingleAuthFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/getSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getSingleAuthFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getSingleAuthFetchStatusSliceReducer = getSingleAuthFetchStatusSlice.reducer
export const getSingleAuthFetchStatusActions = getSingleAuthFetchStatusSlice.actions


/**
 * app.fetchStatus.auth.put state Slice
 *
 *  - update auth data of the same id
 **/
export type putAuthFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putAuthFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putAuthFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putAuthFetchStatusSliceReducer = putAuthFetchStatusSlice.reducer
export const putAuthFetchStatusActions = putAuthFetchStatusSlice.actions

/**
 * app.fetchStatus.auth.put state Slice
 *
 *  - update auth data of the same id
 **/
export type postAuthPhoneFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postAuthPhoneFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/phone/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postAuthPhoneFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postAuthPhoneFetchStatusSliceReducer = postAuthPhoneFetchStatusSlice.reducer
export const postAuthPhoneFetchStatusActions = postAuthPhoneFetchStatusSlice.actions

/**
 * app.fetchStatus.auth.put state Slice
 *
 *  - update auth data of the same id
 **/
export type putAuthPhoneFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putAuthPhoneFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/phone/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putAuthPhoneFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putAuthPhoneFetchStatusSliceReducer = putAuthPhoneFetchStatusSlice.reducer
export const putAuthPhoneFetchStatusActions = putAuthPhoneFetchStatusSlice.actions

/**
 * app.fetchStatus.auth.put state Slice
 *
 *  - update auth data of the same id
 **/
export type patchAuthPhoneFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const patchAuthPhoneFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/phone/patch", // a name used in action type
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
    update: (state: FetchStatusEnum, action: patchAuthPhoneFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const patchAuthPhoneFetchStatusSliceReducer = patchAuthPhoneFetchStatusSlice.reducer
export const patchAuthPhoneFetchStatusActions = patchAuthPhoneFetchStatusSlice.actions

/**
 * app.fetchStatus.auth.delete state Slice
 *
 *  - update auth data of the same id
 **/
export type deleteAuthPhoneFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteAuthPhoneFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/phone/delete", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteAuthPhoneFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteAuthPhoneFetchStatusSliceReducer = deleteAuthPhoneFetchStatusSlice.reducer
export const deleteAuthPhoneFetchStatusActions = deleteAuthPhoneFetchStatusSlice.actions

/**
 * app.fetchStatus.auth.put state Slice
 *
 *  - update auth data of the same id
 **/
export type postAuthAddressFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postAuthAddressFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/address/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postAuthAddressFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postAuthAddressFetchStatusSliceReducer = postAuthAddressFetchStatusSlice.reducer
export const postAuthAddressFetchStatusActions = postAuthAddressFetchStatusSlice.actions

/**
 * app.fetchStatus.auth.put state Slice
 *
 *  - update auth data of the same id
 **/
export type putAuthAddressFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putAuthAddressFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/address/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putAuthAddressFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putAuthAddressFetchStatusSliceReducer = putAuthAddressFetchStatusSlice.reducer
export const putAuthAddressFetchStatusActions = putAuthAddressFetchStatusSlice.actions

/**
 * app.fetchStatus.auth.put state Slice
 *
 *  - update auth data of the same id
 **/
export type patchAuthAddressFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const patchAuthAddressFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/address/patch", // a name used in action type
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
    update: (state: FetchStatusEnum, action: patchAuthAddressFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const patchAuthAddressFetchStatusSliceReducer = patchAuthAddressFetchStatusSlice.reducer
export const patchAuthAddressFetchStatusActions = patchAuthAddressFetchStatusSlice.actions

/**
 * app.fetchStatus.auth.delete state Slice
 *
 *  - update auth data of the same id
 **/
export type deleteAuthAddressFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteAuthAddressFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/address/delete", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteAuthAddressFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteAuthAddressFetchStatusSliceReducer = deleteAuthAddressFetchStatusSlice.reducer
export const deleteAuthAddressFetchStatusActions = deleteAuthAddressFetchStatusSlice.actions

/**
 * app.fetchStatus.auth.delete state Slice
 **/
export type postAuthAvatarImageFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postAuthAvatarImageFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/avatar-image/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postAuthAvatarImageFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postAuthAvatarImageFetchStatusSliceReducer = postAuthAvatarImageFetchStatusSlice.reducer
export const postAuthAvatarImageFetchStatusActions = postAuthAvatarImageFetchStatusSlice.actions


/**
 * app.fetchStatus.auth.delete state Slice
 **/
export type deleteAuthAvatarImageFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteAuthAvatarImageFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/avatar-image/delete", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteAuthAvatarImageFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteAuthAvatarImageFetchStatusSliceReducer = deleteAuthAvatarImageFetchStatusSlice.reducer
export const deleteAuthAvatarImageFetchStatusActions = deleteAuthAvatarImageFetchStatusSlice.actions


/**
 * app.fetchStatus.auth.put state Slice
 *
 *  - update auth data of the same id
 **/
export type putAuthCompanyFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putAuthCompanyFetchStatusSlice = createSlice({
  name: "app/fetchStatus/auth/company/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putAuthCompanyFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putAuthCompanyFetchStatusSliceReducer = putAuthCompanyFetchStatusSlice.reducer
export const putAuthCompanyFetchStatusActions = putAuthCompanyFetchStatusSlice.actions

