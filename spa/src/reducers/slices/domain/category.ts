import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NormalizedCategoryType } from "domain/product/types";
import merge from "lodash/merge";

/**
 * redux-sage actions
 *
 *  - use this in index.tsx at watchers
 *
 **/
export const fetchCategoryActionCreator = createAction("saga/domain/category/fetch")
export const fetchCategoryActionTypeName = fetchCategoryActionCreator().type

/**
 * domain.categorys state Slice
 *
 **/
// action type             
export type CategoryActionType = PayloadAction<NormalizedCategoryType> 

export const categorySlice = createSlice({ 
  name: "domain/categories", // a name used in action type
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
    merge: (state: NormalizedCategoryType, action: CategoryActionType) => merge(state, action.payload),
    update: (state: NormalizedCategoryType, action: CategoryActionType) => action.payload,
    clear: (state: NormalizedCategoryType) => [],
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const categorySliceReducer = categorySlice.reducer
export const categoryActions = categorySlice.actions
