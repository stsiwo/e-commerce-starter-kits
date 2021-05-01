import { deleteCartItemActionTypeName, deleteSingleCartItemActionTypeName, fetchCartItemActionTypeName, postCartItemActionTypeName, putCartItemActionTypeName } from 'reducers/slices/domain/cartItem';
import { deleteSingleCategoryActionTypeName, fetchCategoryActionTypeName, postCategoryActionTypeName, putCategoryActionTypeName, fetchCategoryWithCacheActionTypeName } from 'reducers/slices/domain/category';
import { fetchOrderActionTypeName, fetchSingleOrderActionTypeName, postOrderActionTypeName, putOrderActionTypeName } from 'reducers/slices/domain/order';
import { deleteSingleProductActionTypeName, fetchProductActionTypeName, fetchSingleProductActionTypeName, postProductActionTypeName, putProductActionTypeName, fetchProductWithCacheActionTypeName } from 'reducers/slices/domain/product';
import { deleteSingleUserActionTypeName, fetchSingleUserActionTypeName, fetchUserActionTypeName, putUserActionTypeName } from 'reducers/slices/domain/user';
import { deleteSingleWishlistItemActionTypeName, deleteWishlistItemActionTypeName, fetchWishlistItemActionTypeName, postWishlistItemActionTypeName } from 'reducers/slices/domain/wishlistItem';
import { toggleLeftNavMenuActionTypeName } from 'reducers/slices/ui';
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { deleteCartItemWorker } from 'sideEffects/workers/cartItem/deleteCartItemWorker';
import { deleteSingleCartItemWorker } from 'sideEffects/workers/cartItem/deleteSingleCartItemWorker';
import { fetchCartItemWorker } from 'sideEffects/workers/cartItem/fetchCartItemWorker';
import { postCartItemWorker } from 'sideEffects/workers/cartItem/postCartItemWorker';
import { putCartItemWorker } from 'sideEffects/workers/cartItem/putCartItemWorker';
import { deleteSingleCategoryWorker } from 'sideEffects/workers/category/deleteSingleCategoryWorker';
import { fetchCategoryWorker } from 'sideEffects/workers/category/fetchCategoryWorker';
import { postCategoryWorker } from 'sideEffects/workers/category/postCategoryWorker';
import { putCategoryWorker } from 'sideEffects/workers/category/putCategoryWorker';
import { leftNavMenuWorkerWorker } from 'sideEffects/workers/leftNavMenuWorker';
import { fetchOrderWorker } from 'sideEffects/workers/order/fetchOrderWorker';
import { fetchSingleOrderWorker } from 'sideEffects/workers/order/fetchSingleOrderWorker';
import { postOrderWorker } from 'sideEffects/workers/order/postOrderWorker';
import { putOrderWorker } from 'sideEffects/workers/order/putOrderWorker';
import { deleteSingleProductWorker } from 'sideEffects/workers/product/deleteSingleProductWorker';
import { fetchProductWorker } from 'sideEffects/workers/product/fetchProductWorker';
import { fetchSingleProductWorker } from 'sideEffects/workers/product/fetchSingleProductWorker';
import { postProductWorker } from 'sideEffects/workers/product/postProductWorker';
import { putProductWorker } from 'sideEffects/workers/product/putProductWorker';
import { deleteSingleUserWorker } from 'sideEffects/workers/user/deleteSingleUserWorker';
import { fetchSingleUserWorker } from 'sideEffects/workers/user/fetchSingleUserWorker';
import { fetchUserWorker } from 'sideEffects/workers/user/fetchUserWorker';
import { putUserWorker } from 'sideEffects/workers/user/putUserWorker';
import { deleteSingleWishlistItemWorker } from 'sideEffects/workers/wishlistItems/deleteSingleWishlistItemWorker';
import { deleteWishlistItemWorker } from 'sideEffects/workers/wishlistItems/deleteWishlistItemWorker';
import { fetchWishlistItemWorker } from 'sideEffects/workers/wishlistItems/fetchWishlistItemWorker';
import { postWishlistItemWorker } from 'sideEffects/workers/wishlistItems/postWishlistItemWorker';
import { requestStripeClientSecretActionTypeName } from 'reducers/slices/app/private/stripeClientSecret';
import { requestStripeClientSecretWorker } from 'sideEffects/workers/private/stripeClientSecret';
import { fetchProductWithCacheWorker } from 'sideEffects/workers/fetchProductWithCacheWorker';
import { fetchCategoryWithCacheWorker } from 'sideEffects/workers/fetchCategoryWithCacheWorker';

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

// user
export function* fetchUserWatcher() {
  yield takeLatest(
    fetchUserActionTypeName,
    fetchUserWorker,
  )
}

export function* fetchSingleUserWatcher() {
  yield takeLatest(
    fetchSingleUserActionTypeName,
    fetchSingleUserWorker,
  )
}

export function* putUserWatcher() {
  yield takeLatest(
    putUserActionTypeName,
    putUserWorker,
  )
}

export function* deleteSingleUserWatcher() {
  yield takeLatest(
    deleteSingleUserActionTypeName,
    deleteSingleUserWorker,
  )
}


// order
export function* fetchOrderWatcher() {
  yield takeLatest(
    fetchOrderActionTypeName,
    fetchOrderWorker,
  )
}

export function* fetchSingleOrderWatcher() {
  yield takeLatest(
    fetchSingleOrderActionTypeName,
    fetchSingleOrderWorker,
  )
}

export function* postOrderWatcher() {
  yield takeLatest(
    postOrderActionTypeName,
    postOrderWorker,
  )
}

export function* putOrderWatcher() {
  yield takeLatest(
    putOrderActionTypeName,
    putOrderWorker,
  )
}

// product
export function* fetchProductWatcher() {
  yield takeLatest(
    fetchProductActionTypeName,
    fetchProductWorker,
  )
}

export function* fetchSingleProductWatcher() {
  yield takeLatest(
    fetchSingleProductActionTypeName,
    fetchSingleProductWorker,
  )
}

export function* postProductWatcher() {
  yield takeLatest(
    postProductActionTypeName,
    postProductWorker,
  )
}

export function* putProductWatcher() {
  yield takeLatest(
    putProductActionTypeName,
    putProductWorker,
  )
}

export function* deleteSingleProductWatcher() {
  yield takeLatest(
    deleteSingleProductActionTypeName,
    deleteSingleProductWorker,
  )
}

// cache
export function* fetchProductWithCacheWatcher() {
  yield takeLatest(
    fetchProductWithCacheActionTypeName,
    fetchProductWithCacheWorker,
  )
}

export function* fetchCategoryWithCacheWatcher() {
  yield takeLatest(
    fetchCategoryWithCacheActionTypeName,
    fetchCategoryWithCacheWorker,
  )
}

// stripeClientSecret request
export function* requestStripeClientSecretWatcher() {
  yield takeLatest(
    requestStripeClientSecretActionTypeName,
    requestStripeClientSecretWorker,
  )
}

