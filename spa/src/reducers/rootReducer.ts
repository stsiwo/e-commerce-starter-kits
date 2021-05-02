import { combineReducers } from 'redux';
import { authSliceReducer, requestTrackerSliceReducer, searchKeywordSliceReducer } from './slices/app';
import { deleteSingleCategoryFetchStatusSliceReducer, getCategoryFetchStatusSliceReducer, postCategoryFetchStatusSliceReducer, putCategoryFetchStatusSliceReducer } from './slices/app/fetchStatus/category';
import { cartItemSliceReducer } from './slices/domain/cartItem';
import { categorySliceReducer } from './slices/domain/category';
import { wishlistItemSliceReducer } from './slices/domain/wishlistItem';
import { leftNavMenuSliceReducer, rightNavMenuSliceReducer, searchModalSliceReducer, cartModalSliceReducer } from './slices/ui';
import { getCartItemFetchStatusSliceReducer, postCartItemFetchStatusSliceReducer, putCartItemFetchStatusSliceReducer, deleteSingleCartItemFetchStatusSliceReducer, deleteCartItemFetchStatusSliceReducer } from './slices/app/fetchStatus/cartItem';
import { getWishlistItemFetchStatusSliceReducer, postWishlistItemFetchStatusSliceReducer, deleteSingleWishlistItemFetchStatusSliceReducer, deleteWishlistItemFetchStatusSliceReducer } from './slices/app/fetchStatus/wishlistItem';
import { getUserFetchStatusSliceReducer, postUserFetchStatusSliceReducer, putUserFetchStatusSliceReducer, deleteSingleUserFetchStatusSliceReducer, patchUserFetchStatusSliceReducer, getSingleUserFetchStatusSliceReducer } from './slices/app/fetchStatus/user';
import { userSliceReducer } from './slices/domain/user';
import { getOrderFetchStatusSliceReducer, getSingleOrderFetchStatusSliceReducer, postOrderFetchStatusSliceReducer, putOrderFetchStatusSliceReducer, deleteSingleOrderFetchStatusSliceReducer } from './slices/app/fetchStatus/order';
import { orderSliceReducer } from './slices/domain/order';
import { getProductFetchStatusSliceReducer, getSingleProductFetchStatusSliceReducer, postProductFetchStatusSliceReducer, putProductFetchStatusSliceReducer, deleteSingleProductFetchStatusSliceReducer } from './slices/app/fetchStatus/product';
import { productSliceReducer, productQuerySearchQuerySliceReducer, productQueryCategoryIdSliceReducer, productQueryMinPriceSliceReducer, productQueryMaxPriceSliceReducer, productQueryReviewPointSliceReducer, productQueryIsDiscountSliceReducer, productQueryStartDateSliceReducer, productQueryEndDateSliceReducer, productQuerySortSliceReducer, productPaginationLimitSliceReducer, productPaginationTotalPagesSliceReducer, productPaginationPageSliceReducer, productCurItemsSliceReducer } from './slices/domain/product';
import { stripeClientSecretSliceReducer } from './slices/app/private/stripeClientSecret';
import { stripeClientSecretFetchStatusSliceReducer } from './slices/app/fetchStatus/stripeClientSecret';

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
    wishlistItems: wishlistItemSliceReducer,
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
