import { combineReducers } from 'redux';
import { requestTrackerSliceReducer, searchKeywordSliceReducer, authSliceReducer, categoryFetchStatusSliceReducer, getCartItemFetchStatusSliceReducer, postCartItemFetchStatusSliceReducer, putCartItemFetchStatusSliceReducer, deleteSingleCartItemFetchStatusSliceReducer, deleteCartItemFetchStatusSliceReducer } from './slices/app';
import { leftNavMenuSliceReducer, rightNavMenuSliceReducer, searchModalSliceReducer } from './slices/ui';
import { categorySliceReducer } from './slices/domain/category';
import { cartItemSliceReducer } from './slices/domain/cartItem';

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
    categoryFetchStatus: categoryFetchStatusSliceReducer,
    fetchStatus: combineReducers({
      cartItems: combineReducers({
        get: getCartItemFetchStatusSliceReducer, 
        post: postCartItemFetchStatusSliceReducer, 
        put: putCartItemFetchStatusSliceReducer, 
        deleteSingle: deleteSingleCartItemFetchStatusSliceReducer, 
        delete: deleteCartItemFetchStatusSliceReducer, 
      })
    })
  }),

  domain: combineReducers({
    categories: categorySliceReducer,
    cartItems: cartItemSliceReducer,
  })
})
