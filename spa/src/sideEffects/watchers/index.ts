import { deleteCartItemActionTypeName, deleteSingleCartItemActionTypeName, fetchCartItemActionTypeName, postCartItemActionTypeName, putCartItemActionTypeName } from 'reducers/slices/domain/cartItem';
import { deleteSingleCategoryActionTypeName, fetchCategoryActionTypeName, fetchCategoryWithCacheActionTypeName, postCategoryActionTypeName, putCategoryActionTypeName } from 'reducers/slices/domain/category';
import { fetchOrderActionTypeName, fetchSingleOrderActionTypeName, postOrderActionTypeName, putOrderActionTypeName, postOrderEventActionTypeName, putOrderEventActionTypeName, deleteSingleOrderEventActionTypeName } from 'reducers/slices/domain/order';
import { deleteSingleProductActionTypeName, fetchProductActionTypeName, fetchProductWithCacheActionTypeName, fetchSingleProductActionTypeName, postProductActionTypeName, putProductActionTypeName, postProductVariantActionTypeName, putProductVariantActionTypeName, deleteSingleProductVariantActionTypeName } from 'reducers/slices/domain/product';
import { deleteSingleUserActionTypeName, fetchSingleUserActionTypeName, fetchUserActionTypeName, putUserActionTypeName, postUserAvatarImageActionTypeName, deleteUserAvatarImageActionTypeName, postUserPhoneActionTypeName, putUserPhoneActionTypeName, patchUserPhoneActionTypeName, deleteUserPhoneActionTypeName, postUserAddressActionTypeName, putUserAddressActionTypeName, patchUserAddressActionTypeName, deleteUserAddressActionTypeName } from 'reducers/slices/domain/user';
import { deleteSingleWishlistItemActionTypeName, deleteWishlistItemActionTypeName, fetchWishlistItemActionTypeName, postWishlistItemActionTypeName, patchWishlistItemActionTypeName } from 'reducers/slices/domain/wishlistItem';
import { requestStripeClientSecretActionTypeName } from 'reducers/slices/sensitive';
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
import { fetchCategoryWithCacheWorker } from 'sideEffects/workers/fetchCategoryWithCacheWorker';
import { fetchProductWithCacheWorker } from 'sideEffects/workers/fetchProductWithCacheWorker';
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
import { requestStripeClientSecretWorker } from 'sideEffects/workers/sensitive/stripeClientSecret';
import { deleteSingleUserWorker } from 'sideEffects/workers/user/deleteSingleUserWorker';
import { fetchSingleUserWorker } from 'sideEffects/workers/user/fetchSingleUserWorker';
import { fetchUserWorker } from 'sideEffects/workers/user/fetchUserWorker';
import { putUserWorker } from 'sideEffects/workers/user/putUserWorker';
import { deleteSingleWishlistItemWorker } from 'sideEffects/workers/wishlistItems/deleteSingleWishlistItemWorker';
import { deleteWishlistItemWorker } from 'sideEffects/workers/wishlistItems/deleteWishlistItemWorker';
import { fetchWishlistItemWorker } from 'sideEffects/workers/wishlistItems/fetchWishlistItemWorker';
import { postWishlistItemWorker } from 'sideEffects/workers/wishlistItems/postWishlistItemWorker';
import { patchWishlistItemWorker } from 'sideEffects/workers/wishlistItems/patchWishlistItemWorker';
import { postUserAvatarImageWorker } from 'sideEffects/workers/user/postUserAvatarImageWorker';
import { deleteUserAvatarImageWorker } from 'sideEffects/workers/user/deleteUserAvatarImageWorker';
import { postAuthAvatarImageActionTypeName, deleteAuthAvatarImageActionTypeName, putAuthActionTypeName, postAuthPhoneActionTypeName, putAuthPhoneActionTypeName, deleteAuthPhoneActionTypeName, patchAuthPhoneActionTypeName, postAuthAddressActionTypeName, putAuthAddressActionTypeName, patchAuthAddressActionTypeName, deleteAuthAddressActionTypeName, putAuthCompanyActionTypeName } from 'reducers/slices/app';
import { postAuthAvatarImageWorker } from 'sideEffects/workers/auth/postAuthAvatarImageWorker';
import { deleteAuthAvatarImageWorker } from 'sideEffects/workers/auth/deleteAuthAvatarImageWorker';
import { putAuthWorker } from 'sideEffects/workers/auth/putAuthWorker';
import { postAuthPhoneWorker } from 'sideEffects/workers/auth/postAuthPhoneWorker';
import { putAuthPhoneWorker } from 'sideEffects/workers/auth/putAuthPhoneWorker';
import { deleteAuthPhoneWorker } from 'sideEffects/workers/auth/deleteAuthPhoneWorker';
import { patchAuthPhoneWorker } from 'sideEffects/workers/auth/patchAuthPhoneWorker';
import { postAuthAddressWorker } from 'sideEffects/workers/auth/postAuthAddressWorker';
import { putAuthAddressWorker } from 'sideEffects/workers/auth/putAuthAddressWorker';
import { patchAuthAddressWorker } from 'sideEffects/workers/auth/patchAuthAddressWorker';
import { deleteAuthAddressWorker } from 'sideEffects/workers/auth/deleteAuthAddressWorker';
import { putAuthCompanyWorker } from 'sideEffects/workers/auth/putAuthCompanyWorker';
import { postProductVariantWorker } from 'sideEffects/workers/product/postProductVariantWorker';
import { putProductVariantWorker } from 'sideEffects/workers/product/putProductVariantWorker';
import { deleteSingleProductVariantWorker } from 'sideEffects/workers/product/deleteSingleProductVariantWorker';
import { postOrderEventWorker } from 'sideEffects/workers/order/postOrderEventWorker';
import { putOrderEventWorker } from 'sideEffects/workers/order/putOrderEventWorker';
import { deleteSingleOrderEventWorker } from 'sideEffects/workers/order/deleteSingleOrderEventWorker';
import { postUserPhoneWorker } from 'sideEffects/workers/user/postUserPhoneWorker';
import { putUserPhoneWorker } from 'sideEffects/workers/user/putUserPhoneWorker';
import { patchUserPhoneWorker } from 'sideEffects/workers/user/patchUserPhoneWorker';
import { deleteUserPhoneWorker } from 'sideEffects/workers/user/deleteUserPhoneWorker';
import { postUserAddressWorker } from 'sideEffects/workers/user/postUserAddressWorker';
import { putUserAddressWorker } from 'sideEffects/workers/user/putUserAddressWorker';
import { patchUserAddressWorker } from 'sideEffects/workers/user/patchUserAddressWorker';
import { deleteUserAddressWorker } from 'sideEffects/workers/user/deleteUserAddressWorker';

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

export function* patchWishlistItemWatcher() {
  yield takeLatest(
    patchWishlistItemActionTypeName,
    patchWishlistItemWorker,
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

export function* postUserAvatarImageWatcher() {
  yield takeLatest(
    postUserAvatarImageActionTypeName,
    postUserAvatarImageWorker,
  )
}

export function* deleteUserAvatarImageWatcher() {
  yield takeLatest(
    deleteUserAvatarImageActionTypeName,
    deleteUserAvatarImageWorker,
  )
}

export function* postUserPhoneWatcher() {
  yield takeLatest(
    postUserPhoneActionTypeName,
    postUserPhoneWorker,
  )
}

export function* putUserPhoneWatcher() {
  yield takeLatest(
    putUserPhoneActionTypeName,
    putUserPhoneWorker,
  )
}

export function* patchUserPhoneWatcher() {
  yield takeLatest(
    patchUserPhoneActionTypeName,
    patchUserPhoneWorker,
  )
}

export function* deleteUserPhoneWatcher() {
  yield takeLatest(
    deleteUserPhoneActionTypeName,
    deleteUserPhoneWorker,
  )
}

export function* postUserAddressWatcher() {
  yield takeLatest(
    postUserAddressActionTypeName,
    postUserAddressWorker,
  )
}

export function* putUserAddressWatcher() {
  yield takeLatest(
    putUserAddressActionTypeName,
    putUserAddressWorker,
  )
}

export function* patchUserAddressWatcher() {
  yield takeLatest(
    patchUserAddressActionTypeName,
    patchUserAddressWorker,
  )
}

export function* deleteUserAddressWatcher() {
  yield takeLatest(
    deleteUserAddressActionTypeName,
    deleteUserAddressWorker,
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

export function* postOrderEventWatcher() {
  yield takeLatest(
    postOrderEventActionTypeName,
    postOrderEventWorker,
  )
}

export function* putOrderEventWatcher() {
  yield takeLatest(
    putOrderEventActionTypeName,
    putOrderEventWorker,
  )
}

export function* deleteSingleOrderEventWatcher() {
  yield takeLatest(
    deleteSingleOrderEventActionTypeName,
    deleteSingleOrderEventWorker,
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

export function* postProductVariantWatcher() {
  yield takeLatest(
    postProductVariantActionTypeName,
    postProductVariantWorker,
  )
}

export function* putProductVariantWatcher() {
  yield takeLatest(
    putProductVariantActionTypeName,
    putProductVariantWorker,
  )
}

export function* deleteSingleProductVariantWatcher() {
  yield takeLatest(
    deleteSingleProductVariantActionTypeName,
    deleteSingleProductVariantWorker,
  )
}

// auth
export function* putAuthWatcher() {
  yield takeLatest(
    putAuthActionTypeName,
    putAuthWorker,
  )
}

export function* postAuthAvatarImageWatcher() {
  yield takeLatest(
    postAuthAvatarImageActionTypeName,
    postAuthAvatarImageWorker,
  )
}

export function* deleteAuthAvatarImageWatcher() {
  yield takeLatest(
    deleteAuthAvatarImageActionTypeName,
    deleteAuthAvatarImageWorker,
  )
}

export function* postAuthPhoneWatcher() {
  yield takeLatest(
    postAuthPhoneActionTypeName,
    postAuthPhoneWorker,
  )
}

export function* putAuthPhoneWatcher() {
  yield takeLatest(
    putAuthPhoneActionTypeName,
    putAuthPhoneWorker,
  )
}

export function* patchAuthPhoneWatcher() {
  yield takeLatest(
    patchAuthPhoneActionTypeName,
    patchAuthPhoneWorker,
  )
}

export function* deleteAuthPhoneWatcher() {
  yield takeLatest(
    deleteAuthPhoneActionTypeName,
    deleteAuthPhoneWorker,
  )
}

export function* postAuthAddressWatcher() {
  yield takeLatest(
    postAuthAddressActionTypeName,
    postAuthAddressWorker,
  )
}

export function* putAuthAddressWatcher() {
  yield takeLatest(
    putAuthAddressActionTypeName,
    putAuthAddressWorker,
  )
}

export function* patchAuthAddressWatcher() {
  yield takeLatest(
    patchAuthAddressActionTypeName,
    patchAuthAddressWorker,
  )
}

export function* deleteAuthAddressWatcher() {
  yield takeLatest(
    deleteAuthAddressActionTypeName,
    deleteAuthAddressWorker,
  )
}

export function* putAuthCompanyWatcher() {
  yield takeLatest(
    putAuthCompanyActionTypeName,
    putAuthCompanyWorker,
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

