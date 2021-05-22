import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { WishlistItemType } from "domain/wishlist/types";
import { deleteSingleWishlistItemFetchStatusActions } from "reducers/slices/app/fetchStatus/wishlistItem";
import { wishlistItemActions, DeleteSingleWishlistItemActionType } from "reducers/slices/domain/wishlistItem";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum, MessageTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { messageActions } from "reducers/slices/app";
import { getNanoId } from "src/utils";

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
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "DELETE",
        url: apiUrl,
      })

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
       * update fetch status sucess
       **/
      yield put(
        deleteSingleWishlistItemFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        deleteSingleWishlistItemFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: error.message, 
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




