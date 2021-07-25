import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { messageActions } from "reducers/slices/app";
import { deleteSingleWishlistItemFetchStatusActions } from "reducers/slices/app/fetchStatus/wishlistItem";
import { DeleteSingleWishlistItemActionType, wishlistItemActions } from "reducers/slices/domain/wishlistItem";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);

/**
 * a worker (generator)    
 *
 *  - delete single wishlist items of current user 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): delete a existing entity 
 *      - (Member): send api request to delete a given entity and delete the entity from redux store 
 *      - (Admin): N/A
 *
 *  - steps:
 *
 *      (Guest):
 *        
 *        g1. delete the target entity from redux store
 *
 *      (Member): 
 *
 *        m1. send delete request to api to delete the target entity 
 *
 *        m2. receive the response and delete it from redux store if success
 *
 *  - note:
 *
 **/
export function* deleteSingleWishlistItemWorker(action: PayloadAction<DeleteSingleWishlistItemActionType>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  /**
   *
   * Member User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.MEMBER) {

    /**
     * update status for anime data
     **/
    yield put(
      deleteSingleWishlistItemFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/wishlistItems/${action.payload.wishlistItemId}`

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() => api({
      method: "DELETE",
      url: apiUrl,
    })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, data: response.data }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )

    /**
     * update fetch status sucess
     **/
    yield put(
      deleteSingleWishlistItemFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update categories domain in state
       *
       *  - receive the updated data as response data
       *
       **/
      yield put(
        wishlistItemActions.delete(action.payload.wishlistItemId)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "deleted successfully.",
        })
      )

    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      log(response.message)

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: response.message
        })
      )
    }


  } else if (curAuth.userType === UserTypeEnum.GUEST) {

    /**
     * Guest User Type
     **/

    /**
     * delete the target entity from redux store
     **/
    yield put(
      wishlistItemActions.delete(action.payload.wishlistItemId)
    )
  }
}




