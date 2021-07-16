import { combineReducers } from 'redux';
import { authSliceReducer, messageSliceReducer, previousUrlSliceReducer, requestTrackerSliceReducer, searchKeywordSliceReducer } from './slices/app';
import { deleteAuthAddressFetchStatusSliceReducer, deleteAuthAvatarImageFetchStatusSliceReducer, deleteAuthPhoneFetchStatusSliceReducer, getSingleAuthFetchStatusSliceReducer, patchAuthAddressFetchStatusSliceReducer, patchAuthPhoneFetchStatusSliceReducer, postAuthAddressFetchStatusSliceReducer, postAuthAvatarImageFetchStatusSliceReducer, postAuthPhoneFetchStatusSliceReducer, putAuthAddressFetchStatusSliceReducer, putAuthCompanyFetchStatusSliceReducer, putAuthFetchStatusSliceReducer, putAuthPhoneFetchStatusSliceReducer, fetchAuthOrderFetchStatusSliceReducer, postAuthOrderEventFetchStatusSliceReducer, fetchSingleAuthOrderFetchStatusSliceReducer } from './slices/app/fetchStatus/auth';
import { deleteCartItemFetchStatusSliceReducer, deleteSingleCartItemFetchStatusSliceReducer, getCartItemFetchStatusSliceReducer, postCartItemFetchStatusSliceReducer, putCartItemFetchStatusSliceReducer } from './slices/app/fetchStatus/cartItem';
import { deleteSingleCategoryFetchStatusSliceReducer, getCategoryFetchStatusSliceReducer, postCategoryFetchStatusSliceReducer, putCategoryFetchStatusSliceReducer } from './slices/app/fetchStatus/category';
import { deleteSingleOrderEventFetchStatusSliceReducer, deleteSingleOrderFetchStatusSliceReducer, getOrderFetchStatusSliceReducer, getSingleOrderFetchStatusSliceReducer, postOrderEventFetchStatusSliceReducer, postOrderFetchStatusSliceReducer, putOrderEventFetchStatusSliceReducer, putOrderFetchStatusSliceReducer, postSessionTimeoutOrderEventFetchStatusSliceReducer, getRatingOrderFetchStatusSliceReducer } from './slices/app/fetchStatus/order';
import { deleteSingleProductFetchStatusSliceReducer, deleteSingleProductVariantFetchStatusSliceReducer, getProductFetchStatusSliceReducer, getPublicProductFetchStatusSliceReducer, getSingleProductFetchStatusSliceReducer, postProductFetchStatusSliceReducer, postProductVariantFetchStatusSliceReducer, putProductFetchStatusSliceReducer, putProductVariantFetchStatusSliceReducer } from './slices/app/fetchStatus/product';
import { deleteSingleReviewFetchStatusSliceReducer, getReviewFetchStatusSliceReducer, postReviewFetchStatusSliceReducer, putReviewFetchStatusSliceReducer } from './slices/app/fetchStatus/review';
import { deleteSingleUserFetchStatusSliceReducer, deleteUserAddressFetchStatusSliceReducer, deleteUserAvatarImageFetchStatusSliceReducer, deleteUserPhoneFetchStatusSliceReducer, getSingleUserFetchStatusSliceReducer, getUserFetchStatusSliceReducer, patchUserAddressFetchStatusSliceReducer, patchUserFetchStatusSliceReducer, patchUserPhoneFetchStatusSliceReducer, postUserAddressFetchStatusSliceReducer, postUserAvatarImageFetchStatusSliceReducer, postUserFetchStatusSliceReducer, postUserPhoneFetchStatusSliceReducer, putUserAddressFetchStatusSliceReducer, putUserFetchStatusSliceReducer, putUserPhoneFetchStatusSliceReducer } from './slices/app/fetchStatus/user';
import { deleteSingleWishlistItemFetchStatusSliceReducer, deleteWishlistItemFetchStatusSliceReducer, getWishlistItemFetchStatusSliceReducer, patchWishlistItemFetchStatusSliceReducer, postWishlistItemFetchStatusSliceReducer } from './slices/app/fetchStatus/wishlistItem';
import { cartItemSliceReducer } from './slices/domain/cartItem';
import { categoryPaginationLimitSliceReducer, categoryPaginationPageSliceReducer, categoryPaginationTotalElementsSliceReducer, categoryPaginationTotalPagesSliceReducer, categorySliceReducer, categoryQuerySearchQuerySliceReducer } from './slices/domain/category';
import { orderPaginationLimitSliceReducer, orderPaginationPageSliceReducer, orderPaginationTotalElementsSliceReducer, orderPaginationTotalPagesSliceReducer, orderQueryEndDateSliceReducer, orderQueryOrderStatusSliceReducer, orderQuerySearchQuerySliceReducer, orderQuerySortSliceReducer, orderQueryStartDateSliceReducer, orderSliceReducer } from './slices/domain/order';
import { productCurItemsSliceReducer, productPaginationLimitSliceReducer, productPaginationPageSliceReducer, productPaginationTotalElementsSliceReducer, productPaginationTotalPagesSliceReducer, productQueryCategoryIdSliceReducer, productQueryEndDateSliceReducer, productQueryIsDiscountSliceReducer, productQueryMaxPriceSliceReducer, productQueryMinPriceSliceReducer, productQueryReviewPointSliceReducer, productQuerySearchQuerySliceReducer, productQuerySortSliceReducer, productQueryStartDateSliceReducer, productSliceReducer } from './slices/domain/product';
import { reviewPaginationLimitSliceReducer, reviewPaginationPageSliceReducer, reviewPaginationTotalElementsSliceReducer, reviewPaginationTotalPagesSliceReducer, reviewQueryEndDateSliceReducer, reviewQueryIsVerifiedSliceReducer, reviewQueryProductIdSliceReducer, reviewQueryReviewPointSliceReducer, reviewQuerySearchQuerySliceReducer, reviewQuerySortSliceReducer, reviewQueryStartDateSliceReducer, reviewQueryUserIdSliceReducer, reviewSliceReducer } from './slices/domain/review';
import { userPaginationLimitSliceReducer, userPaginationPageSliceReducer, userPaginationTotalElementsSliceReducer, userPaginationTotalPagesSliceReducer, userQueryEndDateSliceReducer, userQuerySearchQuerySliceReducer, userQuerySortSliceReducer, userQueryStartDateSliceReducer, userSliceReducer, userQueryActiveSliceReducer } from './slices/domain/user';
import { wishlistItemPaginationLimitSliceReducer, wishlistItemPaginationPageSliceReducer, wishlistItemPaginationTotalElementsSliceReducer, wishlistItemPaginationTotalPagesSliceReducer, wishlistItemQueryEndDateSliceReducer, wishlistItemQueryIsDiscountSliceReducer, wishlistItemQueryMaxPriceSliceReducer, wishlistItemQueryMinPriceSliceReducer, wishlistItemQueryReviewPointSliceReducer, wishlistItemQuerySearchQuerySliceReducer, wishlistItemQuerySortSliceReducer, wishlistItemQueryStartDateSliceReducer, wishlistItemSliceReducer } from './slices/domain/wishlistItem';
import { stripeClientSecretSliceReducer } from './slices/sensitive';
import { cartModalSliceReducer, leftNavMenuSliceReducer, rightNavMenuSliceReducer, searchModalSliceReducer } from './slices/ui';
import { checkoutOrderSliceReducer, checkoutIsRatingSuccessSliceReducer, checkoutSessionStatusSliceReducer } from './slices/domain/checkout';
import { getNotificationFetchStatusSliceReducer, patchNotificationFetchStatusSliceReducer } from './slices/app/fetchStatus/notification';
import { notificationSliceReducer, notificationPaginationSliceReducer, notificationCurIndexSliceReducer } from './slices/domain/notification';
import { getCompanyFetchStatusSliceReducer } from './slices/app/fetchStatus/company';
import { companySliceReducer } from './slices/domain/company';
import { StateType } from 'states/types';
import { PayloadAction } from '@reduxjs/toolkit';

// ** REFACTOR to new approach **/

/**
 * main rootReducer
 *
 * @2021/07/03
 *  
 *  - structure change due to add 'root/reset/all' reducer to clear all state when logout.
 *
 **/
export const rootReducer = (state: StateType, action: PayloadAction<any>) => {
  if (action.type === "root/reset/all") {
    return mainReducer(undefined, action);
  }
  return mainReducer(state, action);
}

const mainReducer = combineReducers({

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
      products: combineReducers({
        get: getProductFetchStatusSliceReducer,
        getPublic: getPublicProductFetchStatusSliceReducer,
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
        postEvent: postOrderEventFetchStatusSliceReducer,
        putEvent: putOrderEventFetchStatusSliceReducer,
        deleteSingleEvent: deleteSingleOrderEventFetchStatusSliceReducer,
        postSessionTimeoutEvent: postSessionTimeoutOrderEventFetchStatusSliceReducer,
        getRating: getRatingOrderFetchStatusSliceReducer,
      }),
      users: combineReducers({
        get: getUserFetchStatusSliceReducer,
        getSingle: getSingleUserFetchStatusSliceReducer,
        post: postUserFetchStatusSliceReducer,
        put: putUserFetchStatusSliceReducer,
        deleteSingle: deleteSingleUserFetchStatusSliceReducer,
        patch: patchUserFetchStatusSliceReducer,
        postPhone: postUserPhoneFetchStatusSliceReducer,
        putPhone: putUserPhoneFetchStatusSliceReducer,
        patchPhone: patchUserPhoneFetchStatusSliceReducer,
        deletePhone: deleteUserPhoneFetchStatusSliceReducer,
        postAddress: postUserAddressFetchStatusSliceReducer,
        putAddress: putUserAddressFetchStatusSliceReducer,
        patchAddress: patchUserAddressFetchStatusSliceReducer,
        deleteAddress: deleteUserAddressFetchStatusSliceReducer,
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
        post: postReviewFetchStatusSliceReducer,
        put: putReviewFetchStatusSliceReducer,
        deleteSingle: deleteSingleReviewFetchStatusSliceReducer,
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
        fetchOrder: fetchAuthOrderFetchStatusSliceReducer,
        fetchSingleOrder: fetchSingleAuthOrderFetchStatusSliceReducer,
        postOrderEvent: postAuthOrderEventFetchStatusSliceReducer,
      }),
      notifications: combineReducers({
        get: getNotificationFetchStatusSliceReducer,
        patch: patchNotificationFetchStatusSliceReducer,
      }),
      company: combineReducers({
        get: getCompanyFetchStatusSliceReducer,
      })
    }),
  }),
  domain: combineReducers({
    categories: combineReducers({
      data: categorySliceReducer,
      query: combineReducers({
        searchQuery: categoryQuerySearchQuerySliceReducer,
      }),
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
      query: combineReducers({
        searchQuery: userQuerySearchQuerySliceReducer,
        active: userQueryActiveSliceReducer,
        startDate: userQueryStartDateSliceReducer,
        endDate: userQueryEndDateSliceReducer,
        sort: userQuerySortSliceReducer,
      }),
      pagination: combineReducers({
        page: userPaginationPageSliceReducer,
        limit: userPaginationLimitSliceReducer,
        totalPages: userPaginationTotalPagesSliceReducer,
        totalElements: userPaginationTotalElementsSliceReducer,
      }),
    }),
    orders: combineReducers({
      data: orderSliceReducer,
      query: combineReducers({
        searchQuery: orderQuerySearchQuerySliceReducer,
        orderStatus: orderQueryOrderStatusSliceReducer,
        startDate: orderQueryStartDateSliceReducer,
        endDate: orderQueryEndDateSliceReducer,
        sort: orderQuerySortSliceReducer,
      }),
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
      query: combineReducers({
        searchQuery: reviewQuerySearchQuerySliceReducer,
        reviewPoint: reviewQueryReviewPointSliceReducer,
        isVerified: reviewQueryIsVerifiedSliceReducer,
        startDate: reviewQueryStartDateSliceReducer,
        endDate: reviewQueryEndDateSliceReducer,
        userId: reviewQueryUserIdSliceReducer,
        productId: reviewQueryProductIdSliceReducer,
        sort: reviewQuerySortSliceReducer,
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
    }),
    checkout: combineReducers({
      sessionStatus: checkoutSessionStatusSliceReducer,
      order: checkoutOrderSliceReducer,
      isRatingSuccess: checkoutIsRatingSuccessSliceReducer
    }),
    notifications: combineReducers({
      data: notificationSliceReducer,
      pagination: notificationPaginationSliceReducer,
      curIndex: notificationCurIndexSliceReducer,
    }),
    company: combineReducers({
      data: companySliceReducer,
    }),
  }),
  sensitive: combineReducers({
    stripeClientSecret: stripeClientSecretSliceReducer,
  })
})
