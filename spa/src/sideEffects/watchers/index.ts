import { toggleLeftNavMenuActionTypeName } from 'reducers/slices/ui';
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { leftNavMenuWorkerWorker } from 'sideEffects/workers/leftNavMenuWorker';
import { fetchCategoryActionTypeName } from 'reducers/slices/domain/category';
import { fetchCategoryWorker } from 'sideEffects/workers/fetchCategoryWorker';
import { fetchCartItemActionTypeName, postCartItemActionTypeName, putCartItemActionTypeName, deleteSingleCartItemActionTypeName, deleteCartItemActionTypeName } from 'reducers/slices/domain/cartItem';
import { fetchCartItemWorker } from 'sideEffects/workers/cartItem/fetchCartItemWorker';
import { postCartItemWorker } from 'sideEffects/workers/cartItem/postCartItemWorker';
import { putCartItemWorker } from 'sideEffects/workers/cartItem/putCartItemWorker';
import { deleteSingleCartItemWorker } from 'sideEffects/workers/cartItem/deleteSingleCartItemWorker';
import { deleteCartItemWorker } from 'sideEffects/workers/cartItem/deleteCartItemWorker';
import { fetchWishlistItemActionTypeName, postWishlistItemActionTypeName, deleteSingleWishlistItemActionTypeName, deleteWishlistItemActionTypeName } from 'reducers/slices/domain/wishlistItem';
import { fetchWishlistItemWorker } from 'sideEffects/workers/wishlistItems/fetchWishlistItemWorker';
import { postWishlistItemWorker } from 'sideEffects/workers/wishlistItems/postWishlistItemWorker';
import { deleteSingleWishlistItemWorker } from 'sideEffects/workers/wishlistItems/deleteSingleWishlistItemWorker';
import { deleteWishlistItemWorker } from 'sideEffects/workers/wishlistItems/deleteWishlistItemWorker';

/**
 * takeEvery: allows multiple worker instances to be started CONCURRENTLY.
 * takeLatest: cancel pending when there is a new one.
 * throttle: type ahead stuff.
/**
 *  watcher
 **/
export function* leftNavMenuWatcher() {
  yield takeEvery(
    toggleLeftNavMenuActionTypeName,
    leftNavMenuWorkerWorker,
  )
}

// categories
export function* categoryFetchWatcher() {
  yield takeLatest(
    fetchCategoryActionTypeName,
    fetchCategoryWorker,
  )
}

// cartItem
export function* fetchCartItemWatcher() {
  yield takeLatest(
    fetchCartItemActionTypeName,
    fetchCartItemWorker,
  )
}

export function* postCartItemWatcher() {
  yield takeLatest(
    postCartItemActionTypeName,
    postCartItemWorker,
  )
}

export function* putCartItemWatcher() {
  yield takeLatest(
    putCartItemActionTypeName,
    putCartItemWorker,
  )
}

export function* deleteSingleCartItemWatcher() {
  yield takeLatest(
    deleteSingleCartItemActionTypeName,
    deleteSingleCartItemWorker,
  )
}

export function* deleteCartItemWatcher() {
  yield takeLatest(
    deleteCartItemActionTypeName,
    deleteCartItemWorker,
  )
}

// wishlist
export function* fetchWishlistItemWatcher() {
  yield takeLatest(
    fetchWishlistItemActionTypeName,
    fetchWishlistItemWorker,
  )
}

export function* postWishlistItemWatcher() {
  yield takeLatest(
    postWishlistItemActionTypeName,
    postWishlistItemWorker,
  )
}

export function* deleteSingleWishlistItemWatcher() {
  yield takeLatest(
    deleteSingleWishlistItemActionTypeName,
    deleteSingleWishlistItemWorker,
  )
}

export function* deleteWishlistItemWatcher() {
  yield takeLatest(
    deleteWishlistItemActionTypeName,
    deleteWishlistItemWorker,
  )
}
