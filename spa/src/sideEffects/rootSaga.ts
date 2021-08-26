import { all, call, spawn } from "redux-saga/effects";
import {
  deleteAuthAddressWatcher,
  deleteAuthAvatarImageWatcher,
  deleteAuthPhoneWatcher,
  deleteCartItemWatcher,
  deleteSingleCartItemWatcher,
  deleteSingleCategoryWatcher,
  deleteSingleOrderEventWatcher,
  deleteSingleProductVariantWatcher,
  deleteSingleProductWatcher,
  deleteSingleReviewWatcher,
  deleteSingleUserWatcher,
  deleteSingleWishlistItemWatcher,
  deleteUserAddressWatcher,
  deleteUserAvatarImageWatcher,
  deleteUserPhoneWatcher,
  deleteWishlistItemWatcher,
  fetchAuthOrderWatcher,
  fetchCartItemWatcher,
  fetchCategoryWatcher,
  fetchCategoryWithCacheWatcher,
  fetchCompanyWatcher,
  fetchNotificationWatcher,
  fetchOrderWatcher,
  fetchProductWatcher,
  fetchProductWithCacheWatcher,
  fetchPublicProductWatcher,
  fetchReviewWatcher,
  fetchSingleAuthOrderWatcher,
  fetchSingleOrderWatcher,
  fetchSingleProductWatcher,
  fetchSingleUserWatcher,
  fetchUserWatcher,
  fetchWishlistItemWatcher,
  incrementNotificationCurIndexWatcher,
  leftNavMenuWatcher,
  patchAuthAddressWatcher,
  patchAuthPhoneWatcher,
  patchNotificationWatcher,
  patchUserAddressWatcher,
  patchUserPhoneWatcher,
  patchWishlistItemWatcher,
  postAuthAddressWatcher,
  postAuthAvatarImageWatcher,
  postAuthOrderEventWatcher,
  postAuthPhoneWatcher,
  postCartItemWatcher,
  postCategoryWatcher,
  postOrderEventWatcher,
  postOrderWatcher,
  postProductVariantWatcher,
  postProductWatcher,
  postReviewWatcher,
  postSessionTimeoutOrderEventWatcher,
  postUserAddressWatcher,
  postUserAvatarImageWatcher,
  postUserPhoneWatcher,
  postWishlistItemWatcher,
  putAuthAddressWatcher,
  putAuthCompanyWatcher,
  putAuthPhoneWatcher,
  putAuthWatcher,
  putCartItemWatcher,
  putCategoryWatcher,
  putOrderEventWatcher,
  putOrderWatcher,
  putProductVariantWatcher,
  putProductWatcher,
  putReviewWatcher,
  putUserAddressWatcher,
  putUserPhoneWatcher,
  putUserWatcher,
} from "./watchers";
import { logger } from "configs/logger";
const log = logger(__filename);

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

    /// review
    fetchReviewWatcher,
    postReviewWatcher,
    putReviewWatcher,
    deleteSingleReviewWatcher,

    /// cartItem
    fetchCartItemWatcher,
    postCartItemWatcher,
    putCartItemWatcher,
    deleteSingleCartItemWatcher,
    deleteCartItemWatcher,

    /// wishlistItem
    fetchWishlistItemWatcher,
    postWishlistItemWatcher,
    patchWishlistItemWatcher,
    deleteSingleWishlistItemWatcher,
    deleteWishlistItemWatcher,

    /// category
    fetchCategoryWatcher,
    postCategoryWatcher,
    putCategoryWatcher,
    deleteSingleCategoryWatcher,

    /// user
    fetchUserWatcher,
    fetchSingleUserWatcher,
    putUserWatcher,
    deleteSingleUserWatcher,
    postUserAvatarImageWatcher,
    deleteUserAvatarImageWatcher,
    postUserPhoneWatcher,
    putUserPhoneWatcher,
    patchUserPhoneWatcher,
    deleteUserPhoneWatcher,
    postUserAddressWatcher,
    putUserAddressWatcher,
    patchUserAddressWatcher,
    deleteUserAddressWatcher,

    // auth
    postAuthAvatarImageWatcher,
    deleteAuthAvatarImageWatcher,
    putAuthWatcher,
    postAuthPhoneWatcher,
    putAuthPhoneWatcher,
    patchAuthPhoneWatcher,
    deleteAuthPhoneWatcher,
    postAuthAddressWatcher,
    putAuthAddressWatcher,
    patchAuthAddressWatcher,
    deleteAuthAddressWatcher,
    putAuthCompanyWatcher,
    fetchAuthOrderWatcher,
    fetchSingleAuthOrderWatcher,
    postAuthOrderEventWatcher,

    /// order
    fetchOrderWatcher,
    fetchSingleOrderWatcher,
    postOrderWatcher,
    putOrderWatcher,
    postOrderEventWatcher,
    putOrderEventWatcher,
    deleteSingleOrderEventWatcher,
    postSessionTimeoutOrderEventWatcher,

    /// product
    fetchProductWatcher,
    fetchSingleProductWatcher,
    fetchPublicProductWatcher,
    postProductWatcher,
    putProductWatcher,
    deleteSingleProductWatcher,
    postProductVariantWatcher,
    putProductVariantWatcher,
    deleteSingleProductVariantWatcher,

    /// notification
    fetchNotificationWatcher,
    patchNotificationWatcher,
    incrementNotificationCurIndexWatcher,

    /// company
    fetchCompanyWatcher,

    /// cache
    fetchProductWithCacheWatcher,
    fetchCategoryWithCacheWatcher,
  ];

  /**
   * keep everything (e.g., child tasks) alive
   *   - disconnect all children watchers with this rootSaga
   **/
  yield all(
    sagas.map((saga) =>
      spawn(function* () {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (e) {
            log(e);
          }
        }
      })
    )
  );
}
