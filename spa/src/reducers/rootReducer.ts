import { combineReducers } from 'redux';
import { authSliceReducer, requestTrackerSliceReducer, searchKeywordSliceReducer } from './slices/app';
import { deleteSingleCategoryFetchStatusSliceReducer, getCategoryFetchStatusSliceReducer, postCategoryFetchStatusSliceReducer, putCategoryFetchStatusSliceReducer } from './slices/app/fetchStatus/category';
import { cartItemSliceReducer } from './slices/domain/cartItem';
import { categorySliceReducer } from './slices/domain/category';
import { wishlistItemSliceReducer } from './slices/domain/wishlistItem';
import { leftNavMenuSliceReducer, rightNavMenuSliceReducer, searchModalSliceReducer } from './slices/ui';
import { getCartItemFetchStatusSliceReducer, postCartItemFetchStatusSliceReducer, putCartItemFetchStatusSliceReducer, deleteSingleCartItemFetchStatusSliceReducer, deleteCartItemFetchStatusSliceReducer } from './slices/app/fetchStatus/cartItem';
import { getWishlistItemFetchStatusSliceReducer, postWishlistItemFetchStatusSliceReducer, deleteSingleWishlistItemFetchStatusSliceReducer, deleteWishlistItemFetchStatusSliceReducer } from './slices/app/fetchStatus/wishlistItem';
import { getUserFetchStatusSliceReducer, postUserFetchStatusSliceReducer, putUserFetchStatusSliceReducer, deleteSingleUserFetchStatusSliceReducer, patchUserFetchStatusSliceReducer, getSingleUserFetchStatusSliceReducer } from './slices/app/fetchStatus/user';
import { userSliceReducer } from './slices/domain/user';

// ** REFACTOR to new approach **/

/**
 * new rootReducer
 **/
export const rootReducer = combineReducers({

  ui: combineReducers({
    leftNavMenu: leftNavMenuSliceReducer,
    rightNavMenu: rightNavMenuSliceReducer,
    searchModal: searchModalSliceReducer,
  }),

  app: combineReducers({
    auth: authSliceReducer,
    searchKeyword: searchKeywordSliceReducer,
    requestTracker: requestTrackerSliceReducer,
    fetchStatus: combineReducers({
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
    })
  }),
  domain: combineReducers({
    categories: categorySliceReducer,
    cartItems: cartItemSliceReducer,
    wishlistItems: wishlistItemSliceReducer,
    users: userSliceReducer,
  })
