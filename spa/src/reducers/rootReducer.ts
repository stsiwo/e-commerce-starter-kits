import { combineReducers } from 'redux';
import { requestTrackerSliceReducer, searchKeywordSliceReducer } from './slices/app';
import { leftNavMenuSliceReducer, rightNavMenuSliceReducer, searchModalSliceReducer } from './slices/ui';

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
    searchKeyword: searchKeywordSliceReducer,
    requestTracker: requestTrackerSliceReducer,
  }),

  domain: combineReducers({
  })
})
