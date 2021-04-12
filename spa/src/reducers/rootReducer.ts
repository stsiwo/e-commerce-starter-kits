import { combineReducers } from 'redux';
import { requestTrackerSliceReducer, searchKeywordSliceReducer, authSliceReducer, categoryFetchStatusSliceReducer } from './slices/app';
import { leftNavMenuSliceReducer, rightNavMenuSliceReducer, searchModalSliceReducer } from './slices/ui';
import { categorySliceReducer } from './slices/domain/category';

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
  }),

  domain: combineReducers({
    categories: categorySliceReducer,
  })
})
