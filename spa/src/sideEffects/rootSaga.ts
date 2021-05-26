import { all, call, spawn } from 'redux-saga/effects';
import { deleteCartItemWatcher, deleteSingleCartItemWatcher, fetchCartItemWatcher, leftNavMenuWatcher, postCartItemWatcher, putCartItemWatcher, fetchWishlistItemWatcher, postWishlistItemWatcher, deleteSingleWishlistItemWatcher, deleteWishlistItemWatcher, fetchCategoryWatcher, postCategoryWatcher, putCategoryWatcher, deleteSingleCategoryWatcher, fetchUserWatcher, fetchSingleUserWatcher, putUserWatcher, deleteSingleUserWatcher, fetchOrderWatcher, fetchSingleOrderWatcher, postOrderWatcher, putOrderWatcher, fetchProductWatcher, fetchSingleProductWatcher, postProductWatcher, putProductWatcher, deleteSingleProductWatcher, requestStripeClientSecretWatcher, fetchProductWithCacheWatcher, fetchCategoryWithCacheWatcher, patchWishlistItemWatcher, deleteUserAvatarImageWatcher, postAuthAvatarImageWatcher, deleteAuthAvatarImageWatcher, postUserAvatarImageWatcher, putAuthWatcher, putAuthPhoneWatcher, deleteAuthPhoneWatcher, postAuthPhoneWatcher, patchAuthPhoneWatcher, postAuthAddressWatcher, putAuthAddressWatcher, patchAuthAddressWatcher, deleteAuthAddressWatcher, putAuthCompanyWatcher, postProductVariantWatcher, putProductVariantWatcher, deleteSingleProductVariantWatcher, postOrderEventWatcher, putOrderEventWatcher, deleteSingleOrderEventWatcher } from './watchers';

export function* rootSaga() {

  /**
   *
   * register watchers
   *
   **/
  const sagas: any[] = [
    // app
    leftNavMenuWatcher,

    /// private - clientSecret
    requestStripeClientSecretWatcher,

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

    /// order
    fetchOrderWatcher,
    fetchSingleOrderWatcher,
    postOrderWatcher,
    putOrderWatcher,
    postOrderEventWatcher,
    putOrderEventWatcher,
    deleteSingleOrderEventWatcher,
   
    /// product
    fetchProductWatcher,
    fetchSingleProductWatcher,
    postProductWatcher,
    putProductWatcher,
    deleteSingleProductWatcher,
    postProductVariantWatcher,
    putProductVariantWatcher,
    deleteSingleProductVariantWatcher,

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
