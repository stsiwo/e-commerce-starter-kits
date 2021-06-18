import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType, NormalizedCategoryType, CategoryCriteria } from "domain/product/types";
import merge from "lodash/merge";

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request with cache
export const fetchCategoryWithCacheActionCreator = createAction("saga/domain/category/fetch/cache")
export const fetchCategoryWithCacheActionTypeName = fetchCategoryWithCacheActionCreator().type

// for GET request
export const fetchCategoryActionCreator = createAction("saga/domain/category/fetch")
export const fetchCategoryActionTypeName = fetchCategoryActionCreator().type

// for POST (add a new category item) request
export declare type PostCategoryActionType = CategoryCriteria 
export const postCategoryActionCreator = createAction<PostCategoryActionType>("saga/domain/category/post")
export const postCategoryActionTypeName = postCategoryActionCreator().type

// for PUT (replace) request
export declare type PutCategoryActionType = CategoryCriteria 
export const putCategoryActionCreator = createAction<PutCategoryActionType>("saga/domain/category/put")
export const putCategoryActionTypeName = putCategoryActionCreator().type

// for DELETE (delete single category item) request
export declare type DeleteSingleCategoryActionType = { categoryId: string } 
export const deleteSingleCategoryActionCreator = createAction<DeleteSingleCategoryActionType>("saga/domain/category/deleteSingle")
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
    delete: (state: NormalizedCategoryType, action: PayloadAction<{ categoryId: string }>) => {
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

/**
 *
 * domain.categories.query.searchQuery state Slice (no side effects)
 *
 **/
// action type             
export type CategoryQuerySearchQueryActionType = PayloadAction<string> 

export const categoryQuerySearchQuerySlice = createSlice({ 
  name: "domain/categories/query/searchQuery", // a name used in action type
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
    update: (state: string, action: CategoryQuerySearchQueryActionType) => action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const categoryQuerySearchQuerySliceReducer = categoryQuerySearchQuerySlice.reducer
export const categoryQuerySearchQueryActions = categoryQuerySearchQuerySlice.actions
/**
 *
 * domain.categories.pagination.page state Slice (no side effects)
 *
 **/
// action type             
export type CategoryPaginationPageActionType = PayloadAction<number> 

export const categoryPaginationPageSlice = createSlice({ 
  name: "domain/categories/pagination/page", // a name used in action type
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
    update: (state: string, action: CategoryPaginationPageActionType) => action.payload,
    clear: (state: string) => 0, // start from 0, (not 1)
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const categoryPaginationPageSliceReducer = categoryPaginationPageSlice.reducer
export const categoryPaginationPageActions = categoryPaginationPageSlice.actions


/**
 *
 * domain.categories.pagination.limit state Slice (no side effects)
 *
 **/
// action type             
export type CategoryPaginationLimitActionType = PayloadAction<number> 

export const categoryPaginationLimitSlice = createSlice({ 
  name: "domain/categories/pagination/limit", // a name used in action type
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
    update: (state: string, action: CategoryPaginationLimitActionType) => action.payload,
    clear: (state: string) => 20,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const categoryPaginationLimitSliceReducer = categoryPaginationLimitSlice.reducer
export const categoryPaginationLimitActions = categoryPaginationLimitSlice.actions


/**
 *
 * domain.categories.pagination.totalPages state Slice (no side effects)
 *
 **/
// action type             
export type CategoryPaginationTotalPagesActionType = PayloadAction<number> 

export const categoryPaginationTotalPagesSlice = createSlice({ 
  name: "domain/categories/pagination/totalPages", // a name used in action type
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
    update: (state: string, action: CategoryPaginationTotalPagesActionType) => action.payload,
    clear: (state: string) => 1,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const categoryPaginationTotalPagesSliceReducer = categoryPaginationTotalPagesSlice.reducer
export const categoryPaginationTotalPagesActions = categoryPaginationTotalPagesSlice.actions

/**
 *
 * domain.categories.pagination.totalElements state Slice (no side effects)
 *
 **/
// action type             
export type CategoryPaginationTotalElementsActionType = PayloadAction<number> 

export const categoryPaginationTotalElementsSlice = createSlice({ 
  name: "domain/categories/pagination/totalElements", // a name used in action type
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
    update: (state: number, action: CategoryPaginationTotalElementsActionType) => action.payload,
    clear: (state: number) => 0,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const categoryPaginationTotalElementsSliceReducer = categoryPaginationTotalElementsSlice.reducer
export const categoryPaginationTotalElementsActions = categoryPaginationTotalElementsSlice.actions
