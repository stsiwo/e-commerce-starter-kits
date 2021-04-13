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
    delete: (state: WishlistItemType[], action: PayloadAction<WishlistItemType>) => remove(state, (wishlistItem: WishlistItemType) => wishlistItem.wishlistId == action.payload.wishlistId),

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


