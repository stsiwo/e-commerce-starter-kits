import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType, NormalizedCategoryType } from "domain/product/types";
import merge from "lodash/merge";

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request
export const fetchCategoryActionCreator = createAction("saga/domain/category/fetch")
export const fetchCategoryActionTypeName = fetchCategoryActionCreator().type

// for POST (add a new category item) request
export const postCategoryActionCreator = createAction<CategoryType>("saga/domain/category/post")
export const postCategoryActionTypeName = postCategoryActionCreator().type

// for PUT (replace) request
export const putCategoryActionCreator = createAction<CategoryType>("saga/domain/category/put")
export const putCategoryActionTypeName = putCategoryActionCreator().type

// for DELETE (delete single category item) request
export const deleteSingleCategoryActionCreator = createAction<CategoryType>("saga/domain/category/deleteSingle")
export const deleteSingleCategoryActionTypeName = deleteSingleCategoryActionCreator().type

// for DELETE (delete all of category items) request
export const deleteCategoryActionCreator = createAction<CategoryType>("saga/domain/category/delete")
export const deleteCategoryActionTypeName = deleteCategoryActionCreator().type

/**
 * domain.categorys state Slice (no side effect)
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

    // use when you want to remove a single entity
    delete: (state: NormalizedCategoryType, action: PayloadAction<CategoryType>) => {
      delete state[action.payload.categoryId]
      return state
    },

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
