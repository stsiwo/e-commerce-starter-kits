import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WishlistItemType } from "domain/wishlist/types";
import merge from "lodash/merge";
import remove from 'lodash/remove';

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request
export const fetchWishlistItemActionCreator = createAction("saga/domain/wishlistItem/fetch")
export const fetchWishlistItemActionTypeName = fetchWishlistItemActionCreator().type

// for POST (add a new wishlist item) request
export const postWishlistItemActionCreator = createAction<WishlistItemType>("saga/domain/wishlistItem/post")
export const postWishlistItemActionTypeName = postWishlistItemActionCreator().type

// for DELETE (delete single wishlist item) request
export const deleteSingleWishlistItemActionCreator = createAction("saga/domain/wishlistItem/deleteSingle")
export const deleteSingleWishlistItemActionTypeName = deleteSingleWishlistItemActionCreator().type

// for DELETE (delete all of wishlist items) request
export const deleteWishlistItemActionCreator = createAction("saga/domain/wishlistItem/delete")
export const deleteWishlistItemActionTypeName = deleteWishlistItemActionCreator().type

/**
 *
 * domain.wishlistItems state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemActionType = PayloadAction<WishlistItemType[]> 

export const wishlistItemSlice = createSlice({ 
  name: "domain/wishlistItem", // a name used in action type
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
    merge: (state: WishlistItemType[], action: WishlistItemActionType) => merge(state, action.payload),

    // use when you want to replace
    update: (state: WishlistItemType[], action: WishlistItemActionType) => action.payload,

    // use when you want to remove a single entity
    delete: (state: WishlistItemType[], action: PayloadAction<string>) => remove(state, (wishlistItem: WishlistItemType) => wishlistItem.wishlistId == action.payload),

    clear: (state: WishlistItemType[]) => [],
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemSliceReducer = wishlistItemSlice.reducer
export const wishlistItemActions = wishlistItemSlice.actions


/**
 *
 * domain.wishlistItems.pagination.page state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemPaginationPageActionType = PayloadAction<number> 

export const wishlistItemPaginationPageSlice = createSlice({ 
  name: "domain/wishlistItems/pagination/page", // a name used in action type
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

    // use when you want to replace
    update: (state: string, action: WishlistItemPaginationPageActionType) => action.payload,
    clear: (state: string) => 0, // start from 0, (not 1)
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemPaginationPageSliceReducer = wishlistItemPaginationPageSlice.reducer
export const wishlistItemPaginationPageActions = wishlistItemPaginationPageSlice.actions


/**
 *
 * domain.wishlistItems.pagination.limit state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemPaginationLimitActionType = PayloadAction<number> 

export const wishlistItemPaginationLimitSlice = createSlice({ 
  name: "domain/wishlistItems/pagination/limit", // a name used in action type
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

    // use when you want to replace
    update: (state: string, action: WishlistItemPaginationLimitActionType) => action.payload,
    clear: (state: string) => 20,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemPaginationLimitSliceReducer = wishlistItemPaginationLimitSlice.reducer
export const wishlistItemPaginationLimitActions = wishlistItemPaginationLimitSlice.actions


/**
 *
 * domain.wishlistItems.pagination.totalPages state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemPaginationTotalPagesActionType = PayloadAction<number> 

export const wishlistItemPaginationTotalPagesSlice = createSlice({ 
  name: "domain/wishlistItems/pagination/totalPages", // a name used in action type
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

    // use when you want to replace
    update: (state: string, action: WishlistItemPaginationTotalPagesActionType) => action.payload,
    clear: (state: string) => 1,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemPaginationTotalPagesSliceReducer = wishlistItemPaginationTotalPagesSlice.reducer
export const wishlistItemPaginationTotalPagesActions = wishlistItemPaginationTotalPagesSlice.actions
