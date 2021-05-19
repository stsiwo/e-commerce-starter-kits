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

const composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, initialState as StateType, composeEnhancers(
    applyMiddleware(...middleware)
));

/**
 * register any listeners...
 **/

// persist to localstorage
store.subscribe(() => {

  const auth = store.getState().app.auth
  localStorage.setItem("auth", JSON.stringify(auth));

})

// run saga
/**
 * you have to run sage AFTER 'createStore'
 **/
sagaMiddleware.run(rootSaga)
