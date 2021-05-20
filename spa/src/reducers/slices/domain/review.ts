import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import merge from "lodash/merge";
import { ReviewType } from "domain/review/type";
import remove from 'lodash/remove';

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request with cache
export const fetchReviewWithCacheActionCreator = createAction("saga/domain/review/fetch/cache")
export const fetchReviewWithCacheActionTypeName = fetchReviewWithCacheActionCreator().type

// for GET request
export const fetchReviewActionCreator = createAction("saga/domain/review/fetch")
export const fetchReviewActionTypeName = fetchReviewActionCreator().type

// for POST (add a new review item) request
export const postReviewActionCreator = createAction<ReviewType>("saga/domain/review/post")
export const postReviewActionTypeName = postReviewActionCreator().type

// for PUT (replace) request
export const putReviewActionCreator = createAction<ReviewType>("saga/domain/review/put")
export const putReviewActionTypeName = putReviewActionCreator().type

// for DELETE (delete single review item) request
export const deleteSingleReviewActionCreator = createAction<ReviewType>("saga/domain/review/deleteSingle")
export const deleteSingleReviewActionTypeName = deleteSingleReviewActionCreator().type

// for DELETE (delete all of review items) request
export const deleteReviewActionCreator = createAction<ReviewType>("saga/domain/review/delete")
export const deleteReviewActionTypeName = deleteReviewActionCreator().type

/**
 * domain.reviews state Slice (no side effect)
 *
 **/
// action type             
export type ReviewActionType = PayloadAction<ReviewType[]> 

export const reviewSlice = createSlice({ 
  name: "domain/reviews", // a name used in action type
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

    /**
     * be careful that duplicate might exist.
     *
     * - not unique.
     *
     **/
    concat: (state: ReviewType[], action: ReviewActionType) => {
      return state.concat(action.payload); 
    },

    // use when update existing one (only apply for array: don't use for object)
    updateOne: (state: ReviewType[], action: PayloadAction<ReviewType>) => {
      return state.map((domain: ReviewType) => {
        if (domain.reviewId === action.payload.reviewId) {
          return action.payload
        }
        return domain
      })
    },

    append: (state: ReviewType[], action: PayloadAction<ReviewType>) => merge(state, [action.payload]),

    // use when you want to replace the whole array
    update: (state: ReviewType[], action: ReviewActionType) => {
      console.log("inside cart item reducer")
      console.log(action.payload)
      return action.payload;
    },
    // use when you want to remove a single entity
    delete: (state: ReviewType[], action: PayloadAction<ReviewType>) => {
      /**
       * mutable.
       * original one: the rest of elements
       * return one: the removed elements
       **/
      remove(state, (cartItem: ReviewType) => cartItem.reviewId == action.payload.reviewId)
      return state
    },

    clear: (state: ReviewType[]) => [],
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewSliceReducer = reviewSlice.reducer
export const reviewActions = reviewSlice.actions

/**
 *
 * domain.reviews.pagination.page state Slice (no side effects)
 *
 **/
// action type             
export type ReviewPaginationPageActionType = PayloadAction<number> 

export const reviewPaginationPageSlice = createSlice({ 
  name: "domain/reviews/pagination/page", // a name used in action type
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
    update: (state: string, action: ReviewPaginationPageActionType) => action.payload,
    clear: (state: string) => 0, // start from 0, (not 1)
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewPaginationPageSliceReducer = reviewPaginationPageSlice.reducer
export const reviewPaginationPageActions = reviewPaginationPageSlice.actions


/**
 *
 * domain.reviews.pagination.limit state Slice (no side effects)
 *
 **/
// action type             
export type ReviewPaginationLimitActionType = PayloadAction<number> 

export const reviewPaginationLimitSlice = createSlice({ 
  name: "domain/reviews/pagination/limit", // a name used in action type
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
    update: (state: string, action: ReviewPaginationLimitActionType) => action.payload,
    clear: (state: string) => 20,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewPaginationLimitSliceReducer = reviewPaginationLimitSlice.reducer
export const reviewPaginationLimitActions = reviewPaginationLimitSlice.actions


/**
 *
 * domain.reviews.pagination.totalPages state Slice (no side effects)
 *
 **/
// action type             
export type ReviewPaginationTotalPagesActionType = PayloadAction<number> 

export const reviewPaginationTotalPagesSlice = createSlice({ 
  name: "domain/reviews/pagination/totalPages", // a name used in action type
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
    update: (state: string, action: ReviewPaginationTotalPagesActionType) => action.payload,
    clear: (state: string) => 1,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewPaginationTotalPagesSliceReducer = reviewPaginationTotalPagesSlice.reducer
export const reviewPaginationTotalPagesActions = reviewPaginationTotalPagesSlice.actions

