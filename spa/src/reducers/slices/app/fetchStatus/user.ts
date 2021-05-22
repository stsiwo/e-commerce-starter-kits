import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";

/**
 * app.fetchStatus.user.get state Slice
 **/
export type getUserFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getUserFetchStatusSlice = createSlice({
  name: "app/fetchStatus/user/get", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getUserFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getUserFetchStatusSliceReducer = getUserFetchStatusSlice.reducer
export const getUserFetchStatusActions = getUserFetchStatusSlice.actions

/**
 * app.fetchStatus.user.getSingle state Slice
 **/
export type getSingleUserFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getSingleUserFetchStatusSlice = createSlice({
  name: "app/fetchStatus/user/getSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: getSingleUserFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getSingleUserFetchStatusSliceReducer = getSingleUserFetchStatusSlice.reducer
export const getSingleUserFetchStatusActions = getSingleUserFetchStatusSlice.actions

/**
 * app.fetchStatus.user.post state Slice
 **/
export type postUserFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postUserFetchStatusSlice = createSlice({
  name: "app/fetchStatus/user/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postUserFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postUserFetchStatusSliceReducer = postUserFetchStatusSlice.reducer
export const postUserFetchStatusActions = postUserFetchStatusSlice.actions

/**
 * app.fetchStatus.user.patch state Slice
 *
 *    - to temporarly delete user request
 **/
export type patchUserFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const patchUserFetchStatusSlice = createSlice({
  name: "app/fetchStatus/user/patch", // a name used in action type
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
    update: (state: FetchStatusEnum, action: patchUserFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const patchUserFetchStatusSliceReducer = patchUserFetchStatusSlice.reducer
export const patchUserFetchStatusActions = patchUserFetchStatusSlice.actions

/**
 * app.fetchStatus.user.put state Slice
 *
 *  - update user data of the same id
 **/
export type putUserFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const putUserFetchStatusSlice = createSlice({
  name: "app/fetchStatus/user/put", // a name used in action type
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
    update: (state: FetchStatusEnum, action: putUserFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const putUserFetchStatusSliceReducer = putUserFetchStatusSlice.reducer
export const putUserFetchStatusActions = putUserFetchStatusSlice.actions

/**
 * app.fetchStatus.user.deleteSingle state Slice
 **/
export type deleteSingleUserFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteSingleUserFetchStatusSlice = createSlice({
  name: "app/fetchStatus/user/deleteSingle", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteSingleUserFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteSingleUserFetchStatusSliceReducer = deleteSingleUserFetchStatusSlice.reducer
export const deleteSingleUserFetchStatusActions = deleteSingleUserFetchStatusSlice.actions

/**
 * app.fetchStatus.user.delete state Slice
 **/
export type deleteUserFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteUserFetchStatusSlice = createSlice({
  name: "app/fetchStatus/user/delete", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteUserFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteUserFetchStatusSliceReducer = deleteUserFetchStatusSlice.reducer
export const deleteUserFetchStatusActions = deleteUserFetchStatusSlice.actions


/**
 * app.fetchStatus.user.delete state Slice
 **/
export type postAvatarImageFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const postAvatarImageFetchStatusSlice = createSlice({
  name: "app/fetchStatus/user/avatar-image/post", // a name used in action type
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
    update: (state: FetchStatusEnum, action: postAvatarImageFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const postAvatarImageFetchStatusSliceReducer = postAvatarImageFetchStatusSlice.reducer
export const postAvatarImageFetchStatusActions = postAvatarImageFetchStatusSlice.actions


/**
 * app.fetchStatus.user.delete state Slice
 **/
export type deleteAvatarImageFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const deleteAvatarImageFetchStatusSlice = createSlice({
  name: "app/fetchStatus/user/avatar-image/delete", // a name used in action type
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
    update: (state: FetchStatusEnum, action: deleteAvatarImageFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const deleteAvatarImageFetchStatusSliceReducer = deleteAvatarImageFetchStatusSlice.reducer
export const deleteAvatarImageFetchStatusActions = deleteAvatarImageFetchStatusSlice.actions


