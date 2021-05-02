import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import merge from "lodash/merge";
import remove from 'lodash/remove';
import { ProductType, NormalizedProductType, ProductSortEnum } from "domain/product/types";
import { DomainPaginationType } from "states/types";

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request with cache
export const fetchProductWithCacheActionCreator = createAction("saga/domain/product/fetch/cache")
export const fetchProductWithCacheActionTypeName = fetchProductWithCacheActionCreator().type

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
 * domain.products.data state Slice (no side effects)
 *
 **/
// action type             
export type ProductActionType = PayloadAction<NormalizedProductType> 

export const productSlice = createSlice({ 
  name: "domain/product/data", // a name used in action type
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


/**
 *
 * domain.products.query.searchQuery state Slice (no side effects)
 *
 **/
// action type             
export type ProductQuerySearchQueryActionType = PayloadAction<string> 

export const productQuerySearchQuerySlice = createSlice({ 
  name: "domain/products/query/searchQuery", // a name used in action type
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
    update: (state: string, action: ProductQuerySearchQueryActionType) => action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productQuerySearchQuerySliceReducer = productQuerySearchQuerySlice.reducer
export const productQuerySearchQueryActions = productQuerySearchQuerySlice.actions


/**
 *
 * domain.products.query.categoryId state Slice (no side effects)
 *
 **/
// action type             
export type ProductQueryCategoryIdActionType = PayloadAction<string> 

export const productQueryCategoryIdSlice = createSlice({ 
  name: "domain/products/query/categoryId", // a name used in action type
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
    update: (state: string, action: ProductQueryCategoryIdActionType) => action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productQueryCategoryIdSliceReducer = productQueryCategoryIdSlice.reducer
export const productQueryCategoryIdActions = productQueryCategoryIdSlice.actions


/**
 *
 * domain.products.query.minPrice state Slice (no side effects)
 *
 **/
// action type             
export type ProductQueryMinPriceActionType = PayloadAction<number> 

export const productQueryMinPriceSlice = createSlice({ 
  name: "domain/products/query/minPrice", // a name used in action type
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
    update: (state: string, action: ProductQueryMinPriceActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productQueryMinPriceSliceReducer = productQueryMinPriceSlice.reducer
export const productQueryMinPriceActions = productQueryMinPriceSlice.actions


/**
 *
 * domain.products.query.maxPrice state Slice (no side effects)
 *
 **/
// action type             
export type ProductQueryMaxPriceActionType = PayloadAction<number> 

export const productQueryMaxPriceSlice = createSlice({ 
  name: "domain/products/query/maxPrice", // a name used in action type
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
    update: (state: string, action: ProductQueryMaxPriceActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productQueryMaxPriceSliceReducer = productQueryMaxPriceSlice.reducer
export const productQueryMaxPriceActions = productQueryMaxPriceSlice.actions


/**
 *
 * domain.products.query.reviewPoint state Slice (no side effects)
 *
 **/
// action type             
export type ProductQueryReviewPointActionType = PayloadAction<number> 

export const productQueryReviewPointSlice = createSlice({ 
  name: "domain/products/query/reviewPoint", // a name used in action type
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
    update: (state: string, action: ProductQueryReviewPointActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productQueryReviewPointSliceReducer = productQueryReviewPointSlice.reducer
export const productQueryReviewPointActions = productQueryReviewPointSlice.actions


/**
 *
 * domain.products.query.isDiscount state Slice (no side effects)
 *
 **/
// action type             
export type ProductQueryIsDiscountActionType = PayloadAction<boolean> 

export const productQueryIsDiscountSlice = createSlice({ 
  name: "domain/products/query/isDiscount", // a name used in action type
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
    update: (state: string, action: ProductQueryIsDiscountActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productQueryIsDiscountSliceReducer = productQueryIsDiscountSlice.reducer
export const productQueryIsDiscountActions = productQueryIsDiscountSlice.actions


/**
 *
 * domain.products.query.startDate state Slice (no side effects)
 *
 **/
// action type             
export type ProductQueryStartDateActionType = PayloadAction<Date> 

export const productQueryStartDateSlice = createSlice({ 
  name: "domain/products/query/startDate", // a name used in action type
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
    update: (state: string, action: ProductQueryStartDateActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productQueryStartDateSliceReducer = productQueryStartDateSlice.reducer
export const productQueryStartDateActions = productQueryStartDateSlice.actions


/**
 *
 * domain.products.query.endDate state Slice (no side effects)
 *
 **/
// action type             
export type ProductQueryEndDateActionType = PayloadAction<Date> 

export const productQueryEndDateSlice = createSlice({ 
  name: "domain/products/query/endDate", // a name used in action type
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
    update: (state: string, action: ProductQueryEndDateActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productQueryEndDateSliceReducer = productQueryEndDateSlice.reducer
export const productQueryEndDateActions = productQueryEndDateSlice.actions


/**
 *
 * domain.products.query.sort state Slice (no side effects)
 *
 **/
// action type             
export type ProductQuerySortActionType = PayloadAction<ProductSortEnum> 

export const productQuerySortSlice = createSlice({ 
  name: "domain/products/query/sort", // a name used in action type
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
    update: (state: string, action: ProductQuerySortActionType) => action.payload,
    clear: (state: string) => ProductSortEnum.DATE_DESC,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productQuerySortSliceReducer = productQuerySortSlice.reducer
export const productQuerySortActions = productQuerySortSlice.actions


/**
 *
 * domain.products.pagination state Slice (no side effects).
 *
 * you CANNOT use this since you register reducers for each property (not as whole object)
 *
 **/
// action type             
//export type ProductPaginationActionType = PayloadAction<DomainPaginationType> 
//
//export const productPaginationSlice = createSlice({ 
//  name: "domain/products/pagination", // a name used in action type
//  initialState: {},        
//  reducers: {              
//    /**
//     *
//     *  a property name gonna be the name of action
//     *  its value is the reduce
//     *
//     *  If you need to define the param of the action, use PayloadAction<X> to define its type.
//     *  In this use case, I need to an string param, so I define 'payloadAction<string' like below
//     *
//     **/
//
//    // use when you want to replace
//    update: (state: DomainPaginationType, action: ProductPaginationActionType) => {
//      console.log("inside pagination action");
//      console.log(action.payload)
//      return action.payload
//    },
//    clear: (state: string) => ({
//      page: 0,
//      limit: 20,
//      totalPages: 1,
//    }),
//  },
//  /**
//   * extraReducers property
//   *
//   * You can respond to other action types besides the types it has generated. 
//   *
//   **/
//}) 
//
//export const productPaginationSliceReducer = productPaginationSlice.reducer
//export const productPaginationActions = productPaginationSlice.actions


/**
 *
 * domain.products.pagination.page state Slice (no side effects)
 *
 **/
// action type             
export type ProductPaginationPageActionType = PayloadAction<number> 

export const productPaginationPageSlice = createSlice({ 
  name: "domain/products/pagination/page", // a name used in action type
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
    update: (state: string, action: ProductPaginationPageActionType) => action.payload,
    clear: (state: string) => 0, // start from 0, (not 1)
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productPaginationPageSliceReducer = productPaginationPageSlice.reducer
export const productPaginationPageActions = productPaginationPageSlice.actions


/**
 *
 * domain.products.pagination.limit state Slice (no side effects)
 *
 **/
// action type             
export type ProductPaginationLimitActionType = PayloadAction<number> 

export const productPaginationLimitSlice = createSlice({ 
  name: "domain/products/pagination/limit", // a name used in action type
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
    update: (state: string, action: ProductPaginationLimitActionType) => action.payload,
    clear: (state: string) => 20,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productPaginationLimitSliceReducer = productPaginationLimitSlice.reducer
export const productPaginationLimitActions = productPaginationLimitSlice.actions


/**
 *
 * domain.products.pagination.totalPages state Slice (no side effects)
 *
 **/
// action type             
export type ProductPaginationTotalPagesActionType = PayloadAction<number> 

export const productPaginationTotalPagesSlice = createSlice({ 
  name: "domain/products/pagination/totalPages", // a name used in action type
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
    update: (state: string, action: ProductPaginationTotalPagesActionType) => action.payload,
    clear: (state: string) => 1,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productPaginationTotalPagesSliceReducer = productPaginationTotalPagesSlice.reducer
export const productPaginationTotalPagesActions = productPaginationTotalPagesSlice.actions


/**
 *
 * domain.products.curItems state Slice (no side effects)
 *
 **/
// action type             
export type ProductcurItemsActionType = PayloadAction<string[]> 

export const productCurItemsSlice = createSlice({ 
  name: "domain/products/curItems", // a name used in action type
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
    update: (state: string[], action: ProductcurItemsActionType) => action.payload,
    clear: (state: string[]) => 1,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const productCurItemsSliceReducer = productCurItemsSlice.reducer
export const productCurItemsActions = productCurItemsSlice.actions
