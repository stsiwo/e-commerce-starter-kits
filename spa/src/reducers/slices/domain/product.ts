import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import merge from "lodash/merge";
import remove from 'lodash/remove';
import { ProductType, NormalizedProductType } from "domain/product/types";

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request
export const fetchProductActionCreator = createAction("saga/domain/product/fetch")
export const fetchProductActionTypeName = fetchProductActionCreator().type

// for GET by Id request
export const fetchSingleProductActionCreator = createAction<{ productId: string }>("saga/domain/product/fetchSingle")
export const fetchSingleProductActionTypeName = fetchSingleProductActionCreator().type

// for POST (add a new cart item) request
export const postProductActionCreator = createAction<ProductType>("saga/domain/product/post")
export const postProductActionTypeName = postProductActionCreator().type

// for PUT (replace) request
export const putProductActionCreator = createAction<ProductType>("saga/domain/product/put")
export const putProductActionTypeName = putProductActionCreator().type

// for DELETE (delete single cart item) request
export const deleteSingleProductActionCreator = createAction<ProductType>("saga/domain/product/deleteSingle")
export const deleteSingleProductActionTypeName = deleteSingleProductActionCreator().type

// for DELETE (delete all of cart items) request
export const deleteProductActionCreator = createAction<ProductType>("saga/domain/product/delete")
export const deleteProductActionTypeName = deleteProductActionCreator().type

/**
 *
 * domain.products state Slice (no side effects)
 *
 **/
// action type             
export type ProductActionType = PayloadAction<NormalizedProductType> 

export const productSlice = createSlice({ 
  name: "domain/product", // a name used in action type
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
    merge: (state: NormalizedProductType, action: ProductActionType) => merge(state, action.payload),

    // use when you want to replace
    update: (state: NormalizedProductType, action: ProductActionType) => action.payload,

    // use when you want to remove a single entity
    delete: (state: NormalizedProductType, action: PayloadAction<ProductType>) =>  {
      delete state[action.payload.productId]
      return state
    },

    clear: (state: NormalizedProductType) => ({}),
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productSliceReducer = productSlice.reducer
export const productActions = productSlice.actions


