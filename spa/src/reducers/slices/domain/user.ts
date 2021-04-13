import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import merge from "lodash/merge";
import remove from 'lodash/remove';
import { UserType } from "domain/user/types";

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request
export const fetchUserActionCreator = createAction("saga/domain/user/fetch")
export const fetchUserActionTypeName = fetchUserActionCreator().type

// for GET by Id request
export const fetchSingleUserActionCreator = createAction<{ userId: string }>("saga/domain/user/fetchSingle")
export const fetchSingleUserActionTypeName = fetchSingleUserActionCreator().type

// for POST (add a new cart item) request
export const postUserActionCreator = createAction<UserType>("saga/domain/user/post")
export const postUserActionTypeName = postUserActionCreator().type

// for PUT (replace) request
export const putUserActionCreator = createAction<UserType>("saga/domain/user/put")
export const putUserActionTypeName = putUserActionCreator().type

// for DELETE (delete single cart item) request
export const deleteSingleUserActionCreator = createAction<UserType>("saga/domain/user/deleteSingle")
export const deleteSingleUserActionTypeName = deleteSingleUserActionCreator().type

// for DELETE (delete all of cart items) request
export const deleteUserActionCreator = createAction<UserType>("saga/domain/user/delete")
export const deleteUserActionTypeName = deleteUserActionCreator().type

/**
 *
 * domain.users state Slice (no side effects)
 *
 **/
// action type             
export type UserActionType = PayloadAction<UserType[]> 

export const userSlice = createSlice({ 
  name: "domain/user", // a name used in action type
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

    // use when update existing one
    merge: (state: UserType[], action: UserActionType) => merge(state, action.payload),

    // use when you want to replace
    update: (state: UserType[], action: UserActionType) => action.payload,

    // use when you want to remove a single entity
    delete: (state: UserType[], action: PayloadAction<UserType>) => remove(state, (user: UserType) => user.userId == action.payload.userId),

    clear: (state: UserType[]) => [],
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const userSliceReducer = userSlice.reducer
export const userActions = userSlice.actions
