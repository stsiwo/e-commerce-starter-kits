import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import merge from "lodash/merge";
import { ReviewType, ReviewSortEnum, ReviewCriteria } from "domain/review/type";
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
export declare type PostReviewActionType = ReviewCriteria
export const postReviewActionCreator = createAction<PostReviewActionType>("saga/domain/review/post")
export const postReviewActionTypeName = postReviewActionCreator().type

// for PUT (replace) request
export declare type PutReviewActionType = ReviewCriteria
export const putReviewActionCreator = createAction<PutReviewActionType>("saga/domain/review/put")
export const putReviewActionTypeName = putReviewActionCreator().type

// for DELETE (delete single review item) request
export declare type DeleteSingleReviewActionType = { reviewId: string }
export const deleteSingleReviewActionCreator = createAction<DeleteSingleReviewActionType>("saga/domain/review/deleteSingle")
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
      return action.payload;
    },
    // use when you want to remove a single entity
    delete: (state: ReviewType[], action: PayloadAction<{ reviewId: string }>) => {
      /**
       * mutable.
       * original one: the rest of elements
       * return one: the removed elements
       **/
      remove(state, (review: ReviewType) => review.reviewId == action.payload.reviewId)
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

/**
 *
 * domain.reviews.pagination.totalElements state Slice (no side effects)
 *
 **/
// action type             
export type ReviewPaginationTotalElementsActionType = PayloadAction<number> 

export const reviewPaginationTotalElementsSlice = createSlice({ 
  name: "domain/reviews/pagination/totalElements", // a name used in action type
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
    update: (state: number, action: ReviewPaginationTotalElementsActionType) => action.payload,
    clear: (state: number) => 0,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewPaginationTotalElementsSliceReducer = reviewPaginationTotalElementsSlice.reducer
export const reviewPaginationTotalElementsActions = reviewPaginationTotalElementsSlice.actions


/**
 *
 * domain.reviews.query.searchQuery state Slice (no side effects)
 *
 **/
// action type             
export type ReviewQuerySearchQueryActionType = PayloadAction<string> 

export const reviewQuerySearchQuerySlice = createSlice({ 
  name: "domain/reviews/query/searchQuery", // a name used in action type
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
    update: (state: string, action: ReviewQuerySearchQueryActionType) => action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewQuerySearchQuerySliceReducer = reviewQuerySearchQuerySlice.reducer
export const reviewQuerySearchQueryActions = reviewQuerySearchQuerySlice.actions



/**
 *
 * domain.reviews.query.reviewPoint state Slice (no side effects)
 *
 **/
// action type             
export type ReviewQueryReviewPointActionType = PayloadAction<number> 

export const reviewQueryReviewPointSlice = createSlice({ 
  name: "domain/reviews/query/reviewPoint", // a name used in action type
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
    update: (state: string, action: ReviewQueryReviewPointActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewQueryReviewPointSliceReducer = reviewQueryReviewPointSlice.reducer
export const reviewQueryReviewPointActions = reviewQueryReviewPointSlice.actions


/**
 *
 * domain.reviews.query.isVerified state Slice (no side effects)
 *
 **/
// action type             
export type ReviewQueryIsVerifiedActionType = PayloadAction<boolean> 

export const reviewQueryIsVerifiedSlice = createSlice({ 
  name: "domain/reviews/query/isVerified", // a name used in action type
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
    update: (state: string, action: ReviewQueryIsVerifiedActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewQueryIsVerifiedSliceReducer = reviewQueryIsVerifiedSlice.reducer
export const reviewQueryIsVerifiedActions = reviewQueryIsVerifiedSlice.actions


/**
 *
 * domain.reviews.query.startDate state Slice (no side effects)
 *
 **/
// action type             
export type ReviewQueryStartDateActionType = PayloadAction<Date> 

export const reviewQueryStartDateSlice = createSlice({ 
  name: "domain/reviews/query/startDate", // a name used in action type
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
    update: (state: string, action: ReviewQueryStartDateActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewQueryStartDateSliceReducer = reviewQueryStartDateSlice.reducer
export const reviewQueryStartDateActions = reviewQueryStartDateSlice.actions


/**
 *
 * domain.reviews.query.endDate state Slice (no side effects)
 *
 **/
// action type             
export type ReviewQueryEndDateActionType = PayloadAction<Date> 

export const reviewQueryEndDateSlice = createSlice({ 
  name: "domain/reviews/query/endDate", // a name used in action type
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
    update: (state: string, action: ReviewQueryEndDateActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewQueryEndDateSliceReducer = reviewQueryEndDateSlice.reducer
export const reviewQueryEndDateActions = reviewQueryEndDateSlice.actions


/**
 *
 * domain.reviews.query.productId state Slice (no side effects)
 *
 **/
// action type             
export type ReviewQueryProductIdActionType = PayloadAction<string> 

export const reviewQueryProductIdSlice = createSlice({ 
  name: "domain/reviews/query/productId", // a name used in action type
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
    update: (state: string, action: ReviewQueryProductIdActionType) => action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewQueryProductIdSliceReducer = reviewQueryProductIdSlice.reducer
export const reviewQueryProductIdActions = reviewQueryProductIdSlice.actions



/**
 *
 * domain.reviews.query.userId state Slice (no side effects)
 *
 **/
// action type             
export type ReviewQueryUserIdActionType = PayloadAction<string> 

export const reviewQueryUserIdSlice = createSlice({ 
  name: "domain/reviews/query/userId", // a name used in action type
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
    update: (state: string, action: ReviewQueryUserIdActionType) => action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewQueryUserIdSliceReducer = reviewQueryUserIdSlice.reducer
export const reviewQueryUserIdActions = reviewQueryUserIdSlice.actions




/**
 *
 * domain.reviews.query.sort state Slice (no side effects)
 *
 **/
// action type             
export type ReviewQuerySortActionType = PayloadAction<ReviewSortEnum> 

export const reviewQuerySortSlice = createSlice({ 
  name: "domain/reviews/query/sort", // a name used in action type
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
    update: (state: string, action: ReviewQuerySortActionType) => action.payload,
    clear: (state: string) => ReviewSortEnum.DATE_DESC,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const reviewQuerySortSliceReducer = reviewQuerySortSlice.reducer
export const reviewQuerySortActions = reviewQuerySortSlice.actions
