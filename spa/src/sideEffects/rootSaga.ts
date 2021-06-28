import { all, call, spawn } from 'redux-saga/effects';
import { deleteAuthAddressWatcher, deleteAuthAvatarImageWatcher, deleteAuthPhoneWatcher, deleteCartItemWatcher, deleteSingleCartItemWatcher, deleteSingleCategoryWatcher, deleteSingleOrderEventWatcher, deleteSingleProductVariantWatcher, deleteSingleProductWatcher, deleteSingleReviewWatcher, deleteSingleUserWatcher, deleteSingleWishlistItemWatcher, deleteUserAddressWatcher, deleteUserAvatarImageWatcher, deleteUserPhoneWatcher, deleteWishlistItemWatcher, fetchCartItemWatcher, fetchCategoryWatcher, fetchCategoryWithCacheWatcher, fetchOrderWatcher, fetchProductWatcher, fetchProductWithCacheWatcher, fetchPublicProductWatcher, fetchReviewWatcher, fetchSingleOrderWatcher, fetchSingleProductWatcher, fetchSingleUserWatcher, fetchUserWatcher, fetchWishlistItemWatcher, leftNavMenuWatcher, patchAuthAddressWatcher, patchAuthPhoneWatcher, patchUserAddressWatcher, patchUserPhoneWatcher, patchWishlistItemWatcher, postAuthAddressWatcher, postAuthAvatarImageWatcher, postAuthPhoneWatcher, postCartItemWatcher, postCategoryWatcher, postOrderEventWatcher, postOrderWatcher, postProductVariantWatcher, postProductWatcher, postReviewWatcher, postUserAddressWatcher, postUserAvatarImageWatcher, postUserPhoneWatcher, postWishlistItemWatcher, putAuthAddressWatcher, putAuthCompanyWatcher, putAuthPhoneWatcher, putAuthWatcher, putCartItemWatcher, putCategoryWatcher, putOrderEventWatcher, putOrderWatcher, putProductVariantWatcher, putProductWatcher, putReviewWatcher, putUserAddressWatcher, putUserPhoneWatcher, putUserWatcher, postSessionTimeoutOrderEventWatcher, fetchAuthOrderWatcher, postAuthOrderEventWatcher, fetchSingleAuthOrderWatcher, fetchNotificationWatcher, patchNotificationWatcher, incrementNotificationCurIndexWatcher, fetchCompanyWatcher } from './watchers';

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
