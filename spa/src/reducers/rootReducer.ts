import { combineReducers } from 'redux';
import { authSliceReducer, messageSliceReducer, previousUrlSliceReducer, requestTrackerSliceReducer, searchKeywordSliceReducer } from './slices/app';
import { deleteAuthAvatarImageFetchStatusSliceReducer, getSingleAuthFetchStatusSliceReducer, postAuthAvatarImageFetchStatusSliceReducer, putAuthFetchStatusSliceReducer, postAuthPhoneFetchStatusSliceReducer, putAuthPhoneFetchStatusSliceReducer, deleteAuthPhoneFetchStatusSliceReducer, patchAuthPhoneFetchStatusSliceReducer, postAuthAddressFetchStatusSliceReducer, putAuthAddressFetchStatusSliceReducer, patchAuthAddressFetchStatusSliceReducer, deleteAuthAddressFetchStatusSliceReducer, putAuthCompanyFetchStatusSliceReducer } from './slices/app/fetchStatus/auth';
import { deleteCartItemFetchStatusSliceReducer, deleteSingleCartItemFetchStatusSliceReducer, getCartItemFetchStatusSliceReducer, postCartItemFetchStatusSliceReducer, putCartItemFetchStatusSliceReducer } from './slices/app/fetchStatus/cartItem';
import { deleteSingleCategoryFetchStatusSliceReducer, getCategoryFetchStatusSliceReducer, postCategoryFetchStatusSliceReducer, putCategoryFetchStatusSliceReducer } from './slices/app/fetchStatus/category';
import { deleteSingleOrderFetchStatusSliceReducer, getOrderFetchStatusSliceReducer, getSingleOrderFetchStatusSliceReducer, postOrderFetchStatusSliceReducer, putOrderFetchStatusSliceReducer } from './slices/app/fetchStatus/order';
import { deleteSingleProductFetchStatusSliceReducer, getProductFetchStatusSliceReducer, getSingleProductFetchStatusSliceReducer, postProductFetchStatusSliceReducer, putProductFetchStatusSliceReducer, postProductVariantFetchStatusSliceReducer, putProductVariantFetchStatusSliceReducer, deleteSingleProductVariantFetchStatusSliceReducer } from './slices/app/fetchStatus/product';
import { getReviewFetchStatusSliceReducer } from './slices/app/fetchStatus/review';
import { stripeClientSecretFetchStatusSliceReducer } from './slices/app/fetchStatus/stripeClientSecret';
import { deleteSingleUserFetchStatusSliceReducer, deleteUserAvatarImageFetchStatusSliceReducer, getSingleUserFetchStatusSliceReducer, getUserFetchStatusSliceReducer, patchUserFetchStatusSliceReducer, postUserAvatarImageFetchStatusSliceReducer, postUserFetchStatusSliceReducer, putUserFetchStatusSliceReducer } from './slices/app/fetchStatus/user';
import { deleteSingleWishlistItemFetchStatusSliceReducer, deleteWishlistItemFetchStatusSliceReducer, getWishlistItemFetchStatusSliceReducer, postWishlistItemFetchStatusSliceReducer, patchWishlistItemFetchStatusSliceReducer } from './slices/app/fetchStatus/wishlistItem';
import { cartItemSliceReducer } from './slices/domain/cartItem';
import { categoryPaginationLimitSliceReducer, categoryPaginationPageSliceReducer, categoryPaginationTotalPagesSliceReducer, categorySliceReducer, categoryPaginationTotalElementsSliceReducer } from './slices/domain/category';
import { orderPaginationLimitSliceReducer, orderPaginationPageSliceReducer, orderPaginationTotalPagesSliceReducer, orderSliceReducer, orderPaginationTotalElementsSliceReducer } from './slices/domain/order';
import { productCurItemsSliceReducer, productPaginationLimitSliceReducer, productPaginationPageSliceReducer, productPaginationTotalPagesSliceReducer, productQueryCategoryIdSliceReducer, productQueryEndDateSliceReducer, productQueryIsDiscountSliceReducer, productQueryMaxPriceSliceReducer, productQueryMinPriceSliceReducer, productQueryReviewPointSliceReducer, productQuerySearchQuerySliceReducer, productQuerySortSliceReducer, productQueryStartDateSliceReducer, productSliceReducer, productPaginationTotalElementsSliceReducer } from './slices/domain/product';
import { reviewPaginationLimitSliceReducer, reviewPaginationPageSliceReducer, reviewPaginationTotalPagesSliceReducer, reviewSliceReducer, reviewPaginationTotalElementsSliceReducer } from './slices/domain/review';
import { userPaginationLimitSliceReducer, userPaginationPageSliceReducer, userPaginationTotalPagesSliceReducer, userSliceReducer, userPaginationTotalElementsSliceReducer } from './slices/domain/user';
import { wishlistItemPaginationLimitSliceReducer, wishlistItemPaginationPageSliceReducer, wishlistItemPaginationTotalPagesSliceReducer, wishlistItemQueryEndDateSliceReducer, wishlistItemQueryIsDiscountSliceReducer, wishlistItemQueryMaxPriceSliceReducer, wishlistItemQueryMinPriceSliceReducer, wishlistItemQueryReviewPointSliceReducer, wishlistItemQuerySearchQuerySliceReducer, wishlistItemQuerySortSliceReducer, wishlistItemQueryStartDateSliceReducer, wishlistItemSliceReducer, wishlistItemPaginationTotalElementsSliceReducer } from './slices/domain/wishlistItem';
import { stripeClientSecretSliceReducer } from './slices/sensitive';
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
    previousUrl: previousUrlSliceReducer,
    message: messageSliceReducer,
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
        postVariant: postProductVariantFetchStatusSliceReducer,
        putVariant: putProductVariantFetchStatusSliceReducer,
        deleteSingleVariant: deleteSingleProductVariantFetchStatusSliceReducer,
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
        postAvatarImage: postUserAvatarImageFetchStatusSliceReducer,
        deleteAvatarImage: deleteUserAvatarImageFetchStatusSliceReducer,
      }),
      categories: combineReducers({
        get: getCategoryFetchStatusSliceReducer,
        post: postCategoryFetchStatusSliceReducer,
        put: putCategoryFetchStatusSliceReducer,
        deleteSingle: deleteSingleCategoryFetchStatusSliceReducer,
      }),
      reviews: combineReducers({
        get: getReviewFetchStatusSliceReducer,
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
        patch: patchWishlistItemFetchStatusSliceReducer,
        deleteSingle: deleteSingleWishlistItemFetchStatusSliceReducer,
        delete: deleteWishlistItemFetchStatusSliceReducer,
      }),
      auth: combineReducers({
        getSingle: getSingleAuthFetchStatusSliceReducer,
        put: putAuthFetchStatusSliceReducer,
        postPhone: postAuthPhoneFetchStatusSliceReducer,
        putPhone: putAuthPhoneFetchStatusSliceReducer,
        patchPhone: patchAuthPhoneFetchStatusSliceReducer,
        deletePhone: deleteAuthPhoneFetchStatusSliceReducer,
        postAddress: postAuthAddressFetchStatusSliceReducer,
        putAddress: putAuthAddressFetchStatusSliceReducer,
        patchAddress: patchAuthAddressFetchStatusSliceReducer,
        deleteAddress: deleteAuthAddressFetchStatusSliceReducer,
        postAvatarImage: postAuthAvatarImageFetchStatusSliceReducer,
        deleteAvatarImage: deleteAuthAvatarImageFetchStatusSliceReducer,
        putCompany: putAuthCompanyFetchStatusSliceReducer,
      }),
    }),
  }),
  domain: combineReducers({
    categories: combineReducers({
      data: categorySliceReducer,
      pagination: combineReducers({
        page: categoryPaginationPageSliceReducer,
        limit: categoryPaginationLimitSliceReducer,
        totalPages: categoryPaginationTotalPagesSliceReducer,
        totalElements: categoryPaginationTotalElementsSliceReducer,
      })
    }),
    cartItems: cartItemSliceReducer,
    wishlistItems: combineReducers({
      data: wishlistItemSliceReducer,
      pagination: combineReducers({
        page: wishlistItemPaginationPageSliceReducer,
        limit: wishlistItemPaginationLimitSliceReducer,
        totalPages: wishlistItemPaginationTotalPagesSliceReducer,
        totalElements: wishlistItemPaginationTotalElementsSliceReducer,
      }),
      query: combineReducers({
        searchQuery: wishlistItemQuerySearchQuerySliceReducer,
        minPrice: wishlistItemQueryMinPriceSliceReducer,
        maxPrice: wishlistItemQueryMaxPriceSliceReducer,
        reviewPoint: wishlistItemQueryReviewPointSliceReducer,
        isDiscount: wishlistItemQueryIsDiscountSliceReducer,
        startDate: wishlistItemQueryStartDateSliceReducer,
        endDate: wishlistItemQueryEndDateSliceReducer,
        sort: wishlistItemQuerySortSliceReducer,
      }),
    }),
    users: combineReducers({
      data: userSliceReducer,
      pagination: combineReducers({
        page: userPaginationPageSliceReducer,
        limit: userPaginationLimitSliceReducer,
        totalPages: userPaginationTotalPagesSliceReducer,
        totalElements: userPaginationTotalElementsSliceReducer,
      }),
    }),
    orders: combineReducers({
      data: orderSliceReducer,
      pagination: combineReducers({
        page: orderPaginationPageSliceReducer,
        limit: orderPaginationLimitSliceReducer,
        totalPages: orderPaginationTotalPagesSliceReducer,
        totalElements: orderPaginationTotalElementsSliceReducer,
      }),
    }),
    reviews: combineReducers({
      data: reviewSliceReducer,
      pagination: combineReducers({
        page: reviewPaginationPageSliceReducer,
        limit: reviewPaginationLimitSliceReducer,
        totalPages: reviewPaginationTotalPagesSliceReducer,
        totalElements: reviewPaginationTotalElementsSliceReducer,
      }),
    }),
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
        totalElements: productPaginationTotalElementsSliceReducer,
      }),
      curItems: productCurItemsSliceReducer,
    })
  }),
  sensitive: combineReducers({
    stripeClientSecret: stripeClientSecretSliceReducer,
  })
})
