import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "domain/product/types";
import { WishlistItemCriteria, WishlistItemSortEnum, WishlistItemType } from "domain/wishlist/types";
import remove from 'lodash/remove';

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request
//export declare type FetchWishlistItemActionType = WishlistItemQueryStringCriteria
export const fetchWishlistItemActionCreator = createAction("saga/domain/wishlistItem/fetch")
export const fetchWishlistItemActionTypeName = fetchWishlistItemActionCreator().type

// for POST (add a new wishlist item) request
export declare type PostWishlistItemActionType = WishlistItemCriteria & { product: ProductType }
export const postWishlistItemActionCreator = createAction<PostWishlistItemActionType>("saga/domain/wishlistItem/post")
export const postWishlistItemActionTypeName = postWishlistItemActionCreator().type

// for PATCH (add a new wishlist item) request
export declare type PatchWishlistItemActionType = { wishlistItemId: string }
export const patchWishlistItemActionCreator = createAction<PatchWishlistItemActionType>("saga/domain/wishlistItem/patch")
export const patchWishlistItemActionTypeName = patchWishlistItemActionCreator().type

// for DELETE (delete single wishlist item) request
export declare type DeleteSingleWishlistItemActionType = { wishlistItemId: string } 
export const deleteSingleWishlistItemActionCreator = createAction<DeleteSingleWishlistItemActionType>("saga/domain/wishlistItem/deleteSingle")
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
  initialState: [],        
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

    // use when update existing one (only apply for array: don't use for object)
    updateOne: (state: WishlistItemType[], action: PayloadAction<WishlistItemType>) => {
      return state.map((domain: WishlistItemType) => {
        if (domain.wishlistItemId === action.payload.wishlistItemId) {
          return action.payload
        }
        return domain
      })
    },

    // use when you want to replace
    update: (state: WishlistItemType[], action: WishlistItemActionType) => action.payload,

    // use when you want to remove a single entity
    delete: (state: WishlistItemType[], action: PayloadAction<string>) => {
      remove(state, (wishlistItem: WishlistItemType) => wishlistItem.wishlistItemId == action.payload)
      return state
    },

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
 * domain.wishlistItems.query.searchQuery state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemQuerySearchQueryActionType = PayloadAction<string> 

export const wishlistItemQuerySearchQuerySlice = createSlice({ 
  name: "domain/wishlistItems/query/searchQuery", // a name used in action type
  initialState: "",        
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
    update: (state: string, action: WishlistItemQuerySearchQueryActionType) => action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemQuerySearchQuerySliceReducer = wishlistItemQuerySearchQuerySlice.reducer
export const wishlistItemQuerySearchQueryActions = wishlistItemQuerySearchQuerySlice.actions


/**
 *
 * domain.wishlistItems.query.categoryId state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemQueryCategoryIdActionType = PayloadAction<string> 

export const wishlistItemQueryCategoryIdSlice = createSlice({ 
  name: "domain/wishlistItems/query/categoryId", // a name used in action type
  initialState: "",        
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
    update: (state: string, action: WishlistItemQueryCategoryIdActionType) => action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemQueryCategoryIdSliceReducer = wishlistItemQueryCategoryIdSlice.reducer
export const wishlistItemQueryCategoryIdActions = wishlistItemQueryCategoryIdSlice.actions


/**
 *
 * domain.wishlistItems.query.minPrice state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemQueryMinPriceActionType = PayloadAction<number> 

export const wishlistItemQueryMinPriceSlice = createSlice({ 
  name: "domain/wishlistItems/query/minPrice", // a name used in action type
  initialState: null,        
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
    update: (state: string, action: WishlistItemQueryMinPriceActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemQueryMinPriceSliceReducer = wishlistItemQueryMinPriceSlice.reducer
export const wishlistItemQueryMinPriceActions = wishlistItemQueryMinPriceSlice.actions


/**
 *
 * domain.wishlistItems.query.maxPrice state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemQueryMaxPriceActionType = PayloadAction<number> 

export const wishlistItemQueryMaxPriceSlice = createSlice({ 
  name: "domain/wishlistItems/query/maxPrice", // a name used in action type
  initialState: null,        
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
    update: (state: string, action: WishlistItemQueryMaxPriceActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemQueryMaxPriceSliceReducer = wishlistItemQueryMaxPriceSlice.reducer
export const wishlistItemQueryMaxPriceActions = wishlistItemQueryMaxPriceSlice.actions


/**
 *
 * domain.wishlistItems.query.reviewPoint state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemQueryReviewPointActionType = PayloadAction<number> 

export const wishlistItemQueryReviewPointSlice = createSlice({ 
  name: "domain/wishlistItems/query/reviewPoint", // a name used in action type
  initialState: null,        
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
    update: (state: string, action: WishlistItemQueryReviewPointActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemQueryReviewPointSliceReducer = wishlistItemQueryReviewPointSlice.reducer
export const wishlistItemQueryReviewPointActions = wishlistItemQueryReviewPointSlice.actions


/**
 *
 * domain.wishlistItems.query.isDiscount state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemQueryIsDiscountActionType = PayloadAction<boolean> 

export const wishlistItemQueryIsDiscountSlice = createSlice({ 
  name: "domain/wishlistItems/query/isDiscount", // a name used in action type
  initialState: null,        
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
    update: (state: boolean, action: WishlistItemQueryIsDiscountActionType) => action.payload,
    clear: (state: boolean) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemQueryIsDiscountSliceReducer = wishlistItemQueryIsDiscountSlice.reducer
export const wishlistItemQueryIsDiscountActions = wishlistItemQueryIsDiscountSlice.actions


/**
 *
 * domain.wishlistItems.query.startDate state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemQueryStartDateActionType = PayloadAction<Date> 

export const wishlistItemQueryStartDateSlice = createSlice({ 
  name: "domain/wishlistItems/query/startDate", // a name used in action type
  initialState: null,        
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
    update: (state: Date, action: WishlistItemQueryStartDateActionType) => action.payload,
    clear: (state: Date) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemQueryStartDateSliceReducer = wishlistItemQueryStartDateSlice.reducer
export const wishlistItemQueryStartDateActions = wishlistItemQueryStartDateSlice.actions


/**
 *
 * domain.wishlistItems.query.endDate state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemQueryEndDateActionType = PayloadAction<Date> 

export const wishlistItemQueryEndDateSlice = createSlice({ 
  name: "domain/wishlistItems/query/endDate", // a name used in action type
  initialState: null,        
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
    update: (state: Date, action: WishlistItemQueryEndDateActionType) => action.payload,
    clear: (state: Date) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemQueryEndDateSliceReducer = wishlistItemQueryEndDateSlice.reducer
export const wishlistItemQueryEndDateActions = wishlistItemQueryEndDateSlice.actions


/**
 *
 * domain.wishlistItems.query.sort state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemQuerySortActionType = PayloadAction<WishlistItemSortEnum> 

export const wishlistItemQuerySortSlice = createSlice({ 
  name: "domain/wishlistItems/query/sort", // a name used in action type
  initialState: WishlistItemSortEnum.DATE_DESC,        
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
    update: (state: WishlistItemSortEnum, action: WishlistItemQuerySortActionType) => action.payload,
    clear: (state: WishlistItemSortEnum) => WishlistItemSortEnum.DATE_DESC,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemQuerySortSliceReducer = wishlistItemQuerySortSlice.reducer
export const wishlistItemQuerySortActions = wishlistItemQuerySortSlice.actions


/**
 *
 * domain.wishlistItems.pagination.page state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemPaginationPageActionType = PayloadAction<number> 

export const wishlistItemPaginationPageSlice = createSlice({ 
  name: "domain/wishlistItems/pagination/page", // a name used in action type
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
    update: (state: number, action: WishlistItemPaginationPageActionType) => action.payload,
    clear: (state: number) => 0, // start from 0, (not 1)
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
  initialState: 20,        
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
    update: (state: number, action: WishlistItemPaginationLimitActionType) => action.payload,
    clear: (state: number) => 20,
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
  initialState: 1,        
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
    update: (state: number, action: WishlistItemPaginationTotalPagesActionType) => action.payload,
    clear: (state: number) => 1,
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


/**
 *
 * domain.wishlistItems.pagination.totalElements state Slice (no side effects)
 *
 **/
// action type             
export type WishlistItemPaginationTotalElementsActionType = PayloadAction<number> 

export const wishlistItemPaginationTotalElementsSlice = createSlice({ 
  name: "domain/wishlistItems/pagination/totalElements", // a name used in action type
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
    update: (state: number, action: WishlistItemPaginationTotalElementsActionType) => action.payload,
    clear: (state: number) => 1,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const wishlistItemPaginationTotalElementsSliceReducer = wishlistItemPaginationTotalElementsSlice.reducer
export const wishlistItemPaginationTotalElementsActions = wishlistItemPaginationTotalElementsSlice.actions
