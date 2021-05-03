import { combineReducers } from 'redux';
import { authSliceReducer, requestTrackerSliceReducer, searchKeywordSliceReducer } from './slices/app';
import { deleteCartItemFetchStatusSliceReducer, deleteSingleCartItemFetchStatusSliceReducer, getCartItemFetchStatusSliceReducer, postCartItemFetchStatusSliceReducer, putCartItemFetchStatusSliceReducer } from './slices/app/fetchStatus/cartItem';
import { deleteSingleCategoryFetchStatusSliceReducer, getCategoryFetchStatusSliceReducer, postCategoryFetchStatusSliceReducer, putCategoryFetchStatusSliceReducer } from './slices/app/fetchStatus/category';
import { deleteSingleOrderFetchStatusSliceReducer, getOrderFetchStatusSliceReducer, getSingleOrderFetchStatusSliceReducer, postOrderFetchStatusSliceReducer, putOrderFetchStatusSliceReducer } from './slices/app/fetchStatus/order';
import { deleteSingleProductFetchStatusSliceReducer, getProductFetchStatusSliceReducer, getSingleProductFetchStatusSliceReducer, postProductFetchStatusSliceReducer, putProductFetchStatusSliceReducer } from './slices/app/fetchStatus/product';
import { stripeClientSecretFetchStatusSliceReducer } from './slices/app/fetchStatus/stripeClientSecret';
import { deleteSingleUserFetchStatusSliceReducer, getSingleUserFetchStatusSliceReducer, getUserFetchStatusSliceReducer, patchUserFetchStatusSliceReducer, postUserFetchStatusSliceReducer, putUserFetchStatusSliceReducer } from './slices/app/fetchStatus/user';
import { deleteSingleWishlistItemFetchStatusSliceReducer, deleteWishlistItemFetchStatusSliceReducer, getWishlistItemFetchStatusSliceReducer, postWishlistItemFetchStatusSliceReducer } from './slices/app/fetchStatus/wishlistItem';
import { stripeClientSecretSliceReducer } from './slices/app/private/stripeClientSecret';
import { cartItemSliceReducer } from './slices/domain/cartItem';
import { categorySliceReducer } from './slices/domain/category';
import { orderSliceReducer } from './slices/domain/order';
import { productCurItemsSliceReducer, productPaginationLimitSliceReducer, productPaginationPageSliceReducer, productPaginationTotalPagesSliceReducer, productQueryCategoryIdSliceReducer, productQueryEndDateSliceReducer, productQueryIsDiscountSliceReducer, productQueryMaxPriceSliceReducer, productQueryMinPriceSliceReducer, productQueryReviewPointSliceReducer, productQuerySearchQuerySliceReducer, productQuerySortSliceReducer, productQueryStartDateSliceReducer, productSliceReducer } from './slices/domain/product';
import { userSliceReducer } from './slices/domain/user';
import { wishlistItemSliceReducer, wishlistItemPaginationPageSliceReducer, wishlistItemPaginationLimitSliceReducer, wishlistItemPaginationTotalPagesSliceReducer } from './slices/domain/wishlistItem';
import { cartModalSliceReducer, leftNavMenuSliceReducer, rightNavMenuSliceReducer, searchModalSliceReducer } from './slices/ui';

// ** REFACTOR to new approach **/

/**
 * new rootReducer
 **/
export const rootReducer = combineReducers({

  ui: combineReducers({
    leftNavMenu: leftNavMenuSliceReducer,
    rightNavMenu: rightNavMenuSliceReducer,
    searchModal: searchModalSliceReducer,
    cartModal: cartModalSliceReducer,
  }),

  app: combineReducers({
    auth: authSliceReducer,
    searchKeyword: searchKeywordSliceReducer,
    requestTracker: requestTrackerSliceReducer,
    fetchStatus: combineReducers({
      stripeClientSecret: stripeClientSecretFetchStatusSliceReducer,
      products: combineReducers({
        get: getProductFetchStatusSliceReducer,
        getSingle: getSingleProductFetchStatusSliceReducer,
        post: postProductFetchStatusSliceReducer,
        put: putProductFetchStatusSliceReducer,
        deleteSingle: deleteSingleProductFetchStatusSliceReducer,
      }),
      orders: combineReducers({
        get: getOrderFetchStatusSliceReducer,
        getSingle: getSingleOrderFetchStatusSliceReducer,
        post: postOrderFetchStatusSliceReducer,
        put: putOrderFetchStatusSliceReducer,
        deleteSingle: deleteSingleOrderFetchStatusSliceReducer,
      }),
      users: combineReducers({
        get: getUserFetchStatusSliceReducer,
        getSingle: getSingleUserFetchStatusSliceReducer,
        post: postUserFetchStatusSliceReducer,
        put: putUserFetchStatusSliceReducer,
        deleteSingle: deleteSingleUserFetchStatusSliceReducer,
        patch: patchUserFetchStatusSliceReducer,
      }),
      categories: combineReducers({
        get: getCategoryFetchStatusSliceReducer,
        post: postCategoryFetchStatusSliceReducer,
        put: putCategoryFetchStatusSliceReducer,
        deleteSingle: deleteSingleCategoryFetchStatusSliceReducer,
      }),
      cartItems: combineReducers({
        get: getCartItemFetchStatusSliceReducer,
        post: postCartItemFetchStatusSliceReducer,
        put: putCartItemFetchStatusSliceReducer,
        deleteSingle: deleteSingleCartItemFetchStatusSliceReducer,
        delete: deleteCartItemFetchStatusSliceReducer,
      }),
      wishlistItems: combineReducers({
        get: getWishlistItemFetchStatusSliceReducer,
        post: postWishlistItemFetchStatusSliceReducer,
        deleteSingle: deleteSingleWishlistItemFetchStatusSliceReducer,
        delete: deleteWishlistItemFetchStatusSliceReducer,
      })
    }),
    private: combineReducers({
      stripeClientSecret: stripeClientSecretSliceReducer,
    })
  }),
  domain: combineReducers({
    categories: categorySliceReducer,
    cartItems: cartItemSliceReducer,
    wishlistItems: combineReducers({
      data: wishlistItemSliceReducer,
      pagination: combineReducers({
        page: wishlistItemPaginationPageSliceReducer,
        limit: wishlistItemPaginationLimitSliceReducer,
        totalPages: wishlistItemPaginationTotalPagesSliceReducer,
      }),
    }),
    users: userSliceReducer,
    orders: orderSliceReducer,
    products: combineReducers({
      data: productSliceReducer,
      query: combineReducers({
        searchQuery: productQuerySearchQuerySliceReducer,
        categoryId: productQueryCategoryIdSliceReducer,
        minPrice: productQueryMinPriceSliceReducer,
        maxPrice: productQueryMaxPriceSliceReducer,
        reviewPoint: productQueryReviewPointSliceReducer,
        isDiscount: productQueryIsDiscountSliceReducer,
        startDate: productQueryStartDateSliceReducer,
        endDate: productQueryEndDateSliceReducer,
        sort: productQuerySortSliceReducer,
      }),
      pagination: combineReducers({
        page: productPaginationPageSliceReducer,
        limit: productPaginationLimitSliceReducer,
        totalPages: productPaginationTotalPagesSliceReducer,
      }),
      curItems: productCurItemsSliceReducer,
    })
  })
})
