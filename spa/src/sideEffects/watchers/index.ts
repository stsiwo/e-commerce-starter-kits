import { deleteCartItemActionTypeName, deleteSingleCartItemActionTypeName, fetchCartItemActionTypeName, postCartItemActionTypeName, putCartItemActionTypeName } from 'reducers/slices/domain/cartItem';
import { fetchCategoryActionTypeName, postCategoryActionTypeName, putCategoryActionTypeName, deleteSingleCategoryActionTypeName } from 'reducers/slices/domain/category';
import { deleteSingleWishlistItemActionTypeName, deleteWishlistItemActionTypeName, fetchWishlistItemActionTypeName, postWishlistItemActionTypeName } from 'reducers/slices/domain/wishlistItem';
import { toggleLeftNavMenuActionTypeName } from 'reducers/slices/ui';
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { deleteCartItemWorker } from 'sideEffects/workers/cartItem/deleteCartItemWorker';
import { deleteSingleCartItemWorker } from 'sideEffects/workers/cartItem/deleteSingleCartItemWorker';
import { fetchCartItemWorker } from 'sideEffects/workers/cartItem/fetchCartItemWorker';
import { postCartItemWorker } from 'sideEffects/workers/cartItem/postCartItemWorker';
import { putCartItemWorker } from 'sideEffects/workers/cartItem/putCartItemWorker';
import { fetchCategoryWithCacheWorker } from 'sideEffects/workers/fetchCategoryWorker';
import { leftNavMenuWorkerWorker } from 'sideEffects/workers/leftNavMenuWorker';
import { deleteSingleWishlistItemWorker } from 'sideEffects/workers/wishlistItems/deleteSingleWishlistItemWorker';
import { deleteWishlistItemWorker } from 'sideEffects/workers/wishlistItems/deleteWishlistItemWorker';
import { fetchWishlistItemWorker } from 'sideEffects/workers/wishlistItems/fetchWishlistItemWorker';
import { postWishlistItemWorker } from 'sideEffects/workers/wishlistItems/postWishlistItemWorker';
import { fetchCategoryWorker } from 'sideEffects/workers/category/fetchCategoryWorker';
import { postCategoryWorker } from 'sideEffects/workers/category/postCategoryWorker';
import { putCategoryWorker } from 'sideEffects/workers/category/putCategoryWorker';
import { deleteSingleCategoryWorker } from 'sideEffects/workers/category/deleteSingleCategoryWorker';

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

// category
export function* fetchCategoryWatcher() {
  yield takeLatest(
    fetchCategoryActionTypeName,
    fetchCategoryWorker,
  )
}

export function* postCategoryWatcher() {
  yield takeLatest(
    postCategoryActionTypeName,
    postCategoryWorker,
  )
}

export function* putCategoryWatcher() {
  yield takeLatest(
    putCategoryActionTypeName,
    putCategoryWorker,
  )
}

export function* deleteSingleCategoryWatcher() {
  yield takeLatest(
    deleteSingleCategoryActionTypeName,
    deleteSingleCategoryWorker,
  )
}
