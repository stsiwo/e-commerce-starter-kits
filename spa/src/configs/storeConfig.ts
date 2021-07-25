import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducer } from 'reducers/rootReducer';
import { initialState } from 'states/state';
import { StateType } from 'states/types';
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from 'sideEffects/rootSaga'

/**
 * middleware config
 **/
// saga
const sagaMiddleware = createSagaMiddleware()

// store middleware to array
export const middleware: any[] = [
  sagaMiddleware  
]

/**
 * disable redux devtool when production.
 */
const composeEnhancers = (NODE_ENV !== 'production' && (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ) || compose;
export const store = createStore(rootReducer, initialState as StateType, composeEnhancers(
    applyMiddleware(...middleware)
));

/**
 * register any listeners...
 **/

// persist to localstorage
store.subscribe(() => {

  // for guest users
  const auth = store.getState().app.auth
  localStorage.setItem("auth", JSON.stringify(auth));

  // for guest users
  const cartItems = store.getState().domain.cartItems
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

})

// run saga
/**
 * you have to run sage AFTER 'createStore'
 **/
sagaMiddleware.run(rootSaga)
