import { all, call, spawn } from 'redux-saga/effects';
import { leftNavMenuWatcher, categoryFetchWatcher, fetchCartItemWatcher, postCartItemWatcher, putCartItemWatcher, deleteSingleCartItemWatcher, deleteCartItemWatcher } from './watchers';

export function* rootSaga() {

  /**
   *
   * register watchers
   *
   **/
  const sagas: any[] = [
    leftNavMenuWatcher,
    categoryFetchWatcher,
    fetchCartItemWatcher,
    postCartItemWatcher,
    putCartItemWatcher,
    deleteSingleCartItemWatcher,
    deleteCartItemWatcher,
  ];

  /**
   * keep everything (e.g., child tasks) alive 
   *   - disconnect all children watchers with this rootSaga 
   **/
  yield all(sagas.map((saga) =>
    spawn(function*() {
      while (true) {
        try {
          yield call(saga)
          break
        } catch (e) {
          console.log(e)
        }
      }
    }))
  );

}
