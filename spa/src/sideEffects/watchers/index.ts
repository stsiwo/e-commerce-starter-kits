import { deleteAuthAddressActionTypeName, deleteAuthAvatarImageActionTypeName, deleteAuthPhoneActionTypeName, patchAuthAddressActionTypeName, patchAuthPhoneActionTypeName, postAuthAddressActionTypeName, postAuthAvatarImageActionTypeName, postAuthPhoneActionTypeName, putAuthActionTypeName, putAuthAddressActionTypeName, putAuthCompanyActionTypeName, putAuthPhoneActionTypeName, fetchAuthOrderActionTypeName, postAuthOrderEventActionTypeName, fetchSingleAuthOrderActionTypeName } from 'reducers/slices/app';
import { deleteCartItemActionTypeName, deleteSingleCartItemActionTypeName, fetchCartItemActionTypeName, postCartItemActionTypeName, putCartItemActionTypeName } from 'reducers/slices/domain/cartItem';
import { deleteSingleCategoryActionTypeName, fetchCategoryActionTypeName, fetchCategoryWithCacheActionTypeName, postCategoryActionTypeName, putCategoryActionTypeName } from 'reducers/slices/domain/category';
import { deleteSingleOrderEventActionTypeName, fetchOrderActionTypeName, fetchSingleOrderActionTypeName, postOrderActionTypeName, postOrderEventActionTypeName, postSessionTimeoutOrderEventActionTypeName, putOrderActionTypeName, putOrderEventActionTypeName } from 'reducers/slices/domain/order';
import { deleteSingleProductActionTypeName, deleteSingleProductVariantActionTypeName, fetchProductActionTypeName, fetchProductWithCacheActionTypeName, fetchPublicProductActionTypeName, fetchSingleProductActionTypeName, postProductActionTypeName, postProductVariantActionTypeName, putProductActionTypeName, putProductVariantActionTypeName } from 'reducers/slices/domain/product';
import { deleteSingleReviewActionTypeName, fetchReviewActionTypeName, postReviewActionTypeName, putReviewActionTypeName } from 'reducers/slices/domain/review';
import { deleteSingleUserActionTypeName, deleteUserAddressActionTypeName, deleteUserAvatarImageActionTypeName, deleteUserPhoneActionTypeName, fetchSingleUserActionTypeName, fetchUserActionTypeName, patchUserAddressActionTypeName, patchUserPhoneActionTypeName, postUserAddressActionTypeName, postUserAvatarImageActionTypeName, postUserPhoneActionTypeName, putUserActionTypeName, putUserAddressActionTypeName, putUserPhoneActionTypeName } from 'reducers/slices/domain/user';
import { deleteSingleWishlistItemActionTypeName, deleteWishlistItemActionTypeName, fetchWishlistItemActionTypeName, patchWishlistItemActionTypeName, postWishlistItemActionTypeName } from 'reducers/slices/domain/wishlistItem';
import { toggleLeftNavMenuActionTypeName } from 'reducers/slices/ui';
import { takeEvery, takeLatest, throttle, debounce } from 'redux-saga/effects';
import { deleteAuthAddressWorker } from 'sideEffects/workers/auth/deleteAuthAddressWorker';
import { deleteAuthAvatarImageWorker } from 'sideEffects/workers/auth/deleteAuthAvatarImageWorker';
import { deleteAuthPhoneWorker } from 'sideEffects/workers/auth/deleteAuthPhoneWorker';
import { patchAuthAddressWorker } from 'sideEffects/workers/auth/patchAuthAddressWorker';
import { patchAuthPhoneWorker } from 'sideEffects/workers/auth/patchAuthPhoneWorker';
import { postAuthAddressWorker } from 'sideEffects/workers/auth/postAuthAddressWorker';
import { postAuthAvatarImageWorker } from 'sideEffects/workers/auth/postAuthAvatarImageWorker';
import { postAuthPhoneWorker } from 'sideEffects/workers/auth/postAuthPhoneWorker';
import { putAuthAddressWorker } from 'sideEffects/workers/auth/putAuthAddressWorker';
import { putAuthCompanyWorker } from 'sideEffects/workers/auth/putAuthCompanyWorker';
import { putAuthPhoneWorker } from 'sideEffects/workers/auth/putAuthPhoneWorker';
import { putAuthWorker } from 'sideEffects/workers/auth/putAuthWorker';
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
import { deleteSingleOrderEventWorker } from 'sideEffects/workers/order/deleteSingleOrderEventWorker';
import { fetchOrderWorker } from 'sideEffects/workers/order/fetchOrderWorker';
import { fetchSingleOrderWorker } from 'sideEffects/workers/order/fetchSingleOrderWorker';
import { postOrderEventWorker } from 'sideEffects/workers/order/postOrderEventWorker';
import { postOrderWorker } from 'sideEffects/workers/order/postOrderWorker';
import { postSessionTimeoutOrderEventWorker } from 'sideEffects/workers/order/postSessionTimeoutOrderEventWorker';
import { putOrderEventWorker } from 'sideEffects/workers/order/putOrderEventWorker';
import { putOrderWorker } from 'sideEffects/workers/order/putOrderWorker';
import { deleteSingleProductVariantWorker } from 'sideEffects/workers/product/deleteSingleProductVariantWorker';
import { deleteSingleProductWorker } from 'sideEffects/workers/product/deleteSingleProductWorker';
import { fetchProductWorker } from 'sideEffects/workers/product/fetchProductWorker';
import { fetchPublicProductWorker } from 'sideEffects/workers/product/fetchPublicProductWorker';
import { fetchSingleProductWorker } from 'sideEffects/workers/product/fetchSingleProductWorker';
import { postProductVariantWorker } from 'sideEffects/workers/product/postProductVariantWorker';
import { postProductWorker } from 'sideEffects/workers/product/postProductWorker';
import { putProductVariantWorker } from 'sideEffects/workers/product/putProductVariantWorker';
import { putProductWorker } from 'sideEffects/workers/product/putProductWorker';
import { deleteSingleReviewWorker } from 'sideEffects/workers/review/deleteSingleReviewWorker';
import { fetchReviewWorker } from 'sideEffects/workers/review/fetchReviewWorker';
import { postReviewWorker } from 'sideEffects/workers/review/postReviewWorker';
import { putReviewWorker } from 'sideEffects/workers/review/putReviewWorker';
import { deleteSingleUserWorker } from 'sideEffects/workers/user/deleteSingleUserWorker';
import { deleteUserAddressWorker } from 'sideEffects/workers/user/deleteUserAddressWorker';
import { deleteUserAvatarImageWorker } from 'sideEffects/workers/user/deleteUserAvatarImageWorker';
import { deleteUserPhoneWorker } from 'sideEffects/workers/user/deleteUserPhoneWorker';
import { fetchSingleUserWorker } from 'sideEffects/workers/user/fetchSingleUserWorker';
import { fetchUserWorker } from 'sideEffects/workers/user/fetchUserWorker';
import { patchUserAddressWorker } from 'sideEffects/workers/user/patchUserAddressWorker';
import { patchUserPhoneWorker } from 'sideEffects/workers/user/patchUserPhoneWorker';
import { postUserAddressWorker } from 'sideEffects/workers/user/postUserAddressWorker';
import { postUserAvatarImageWorker } from 'sideEffects/workers/user/postUserAvatarImageWorker';
import { postUserPhoneWorker } from 'sideEffects/workers/user/postUserPhoneWorker';
import { putUserAddressWorker } from 'sideEffects/workers/user/putUserAddressWorker';
import { putUserPhoneWorker } from 'sideEffects/workers/user/putUserPhoneWorker';
import { putUserWorker } from 'sideEffects/workers/user/putUserWorker';
import { deleteSingleWishlistItemWorker } from 'sideEffects/workers/wishlistItems/deleteSingleWishlistItemWorker';
import { deleteWishlistItemWorker } from 'sideEffects/workers/wishlistItems/deleteWishlistItemWorker';
import { fetchWishlistItemWorker } from 'sideEffects/workers/wishlistItems/fetchWishlistItemWorker';
import { patchWishlistItemWorker } from 'sideEffects/workers/wishlistItems/patchWishlistItemWorker';
import { postWishlistItemWorker } from 'sideEffects/workers/wishlistItems/postWishlistItemWorker';
import { fetchAuthOrderWorker } from 'sideEffects/workers/auth/fetchAuthOrderWorker';
import { postAuthOrderEventWorker } from 'sideEffects/workers/auth/postAuthOrderEventWorker';
import { fetchSingleAuthOrderWorker } from 'sideEffects/workers/auth/fetchSingleAuthOrderWorker';
import { fetchNotificationActionTypeName, patchNotificationActionTypeName, incrementNotificationCurIndexActionTypeName } from 'reducers/slices/domain/notification';
import { fetchNotificationWorker } from 'sideEffects/workers/notification/fetchNotificationWorker';
import { patchNotificationWorker } from 'sideEffects/workers/notification/patchNotificationWorker';
import { incrementNotificationCurIndexWorker } from 'sideEffects/workers/notification/incrementNotificationCurIndexWorker';
import { fetchCompanyActionTypeName } from 'reducers/slices/domain/company';
import { fetchCompanyWorker } from 'sideEffects/workers/company/fetchCompanyWorker';

/**
 * takeEvery: allows multiple worker instances to be started CONCURRENTLY.
 * takeLatest: cancel pending when there is a new one.
 * throttle: don't use for type ahead. does nto work. 
 * debounce: use this for type ahead.
/**
 *  watcher
 **/
export function* leftNavMenuWatcher() {
  yield takeEvery(
    toggleLeftNavMenuActionTypeName,
    leftNavMenuWorkerWorker,
  )
}

// review
export function* fetchReviewWatcher() {
  yield debounce(
    500,
    fetchReviewActionTypeName,
    fetchReviewWorker,
  )
}

export function* postReviewWatcher() {
  yield takeLatest(
    postReviewActionTypeName,
    postReviewWorker,
  )
}

export function* putReviewWatcher() {
  yield takeLatest(
    putReviewActionTypeName,
    putReviewWorker,
  )
}

export function* deleteSingleReviewWatcher() {
  yield takeLatest(
    deleteSingleReviewActionTypeName,
    deleteSingleReviewWorker,
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
  yield debounce(
    500,
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
  yield debounce(
    500,
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
  yield debounce(
    500,
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
  yield debounce(
    500,
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

export function* postSessionTimeoutOrderEventWatcher() {
  yield takeLatest(
    postSessionTimeoutOrderEventActionTypeName,
    postSessionTimeoutOrderEventWorker,
  )
}

// product
export function* fetchProductWatcher() {
  yield debounce(
    500,
    fetchProductActionTypeName,
    fetchProductWorker,
  )
}

export function* fetchPublicProductWatcher() {
  yield debounce(
    500,
    fetchPublicProductActionTypeName,
    fetchPublicProductWorker,
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

export function* fetchAuthOrderWatcher() {
  yield takeLatest(
    fetchAuthOrderActionTypeName,
    fetchAuthOrderWorker,
  )
}

export function* fetchSingleAuthOrderWatcher() {
  yield takeLatest(
    fetchSingleAuthOrderActionTypeName,
    fetchSingleAuthOrderWorker,
  )
}

export function* postAuthOrderEventWatcher() {
  yield takeLatest(
    postAuthOrderEventActionTypeName,
    postAuthOrderEventWorker,
  )
}

// notification
export function* fetchNotificationWatcher() {
  yield takeLatest(
    fetchNotificationActionTypeName,
    fetchNotificationWorker,
  )
}

export function* patchNotificationWatcher() {
  yield takeLatest(
    patchNotificationActionTypeName,
    patchNotificationWorker,
  )
}

export function* incrementNotificationCurIndexWatcher() {
  yield takeLatest(
    incrementNotificationCurIndexActionTypeName,
    incrementNotificationCurIndexWorker,
  )
}

// company
export function* fetchCompanyWatcher() {
  yield takeLatest(
    fetchCompanyActionTypeName,
    fetchCompanyWorker,
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

