import { all, call, spawn } from 'redux-saga/effects';
import { deleteCartItemWatcher, deleteSingleCartItemWatcher, fetchCartItemWatcher, leftNavMenuWatcher, postCartItemWatcher, putCartItemWatcher, fetchWishlistItemWatcher, postWishlistItemWatcher, deleteSingleWishlistItemWatcher, deleteWishlistItemWatcher, fetchCategoryWatcher, postCategoryWatcher, putCategoryWatcher, deleteSingleCategoryWatcher } from './watchers';

export function* rootSaga() {

  /**
   *
   * register watchers
   *
   **/
  const sagas: any[] = [
    // app
    leftNavMenuWatcher,

    // ui
    

    // domain
    
    /// cartItem
    fetchCartItemWatcher,
    postCartItemWatcher,
    putCartItemWatcher,
    deleteSingleCartItemWatcher,
    deleteCartItemWatcher,
    
    /// wishlistItem
    fetchWishlistItemWatcher,
    postWishlistItemWatcher,
    deleteSingleWishlistItemWatcher,
    deleteWishlistItemWatcher,
    
    /// category
    fetchCategoryWatcher,
    postCategoryWatcher,
    putCategoryWatcher,
    deleteSingleCategoryWatcher,
    
  ]

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
