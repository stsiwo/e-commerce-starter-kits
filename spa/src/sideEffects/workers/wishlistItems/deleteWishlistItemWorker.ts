import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { WishlistItemType } from "domain/wishlist/types";
import { deleteWishlistItemFetchStatusActions } from "reducers/slices/app/fetchStatus/wishlistItem";
import { wishlistItemActions } from "reducers/slices/domain/wishlistItem";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);

/**
 * a worker (generator)    
 *
 *  - delete all wishlist items of current user 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): delete all entities 
 *      - (Member): send api request to delete all entities and delete the entities from redux store 
 *      - (Admin): N/A
 *
 *  - steps:
 *
 *      (Guest):
 *        
 *        g1. delete all entities from redux store
 *
 *      (Member): 
 *
 *        m1. send delete request to api to delete all entities
 *
 *        m2. receive the response and delete it from redux store if success
 *
 *  - note:
 *
 **/
export function* deleteWishlistItemWorker(action: PayloadAction<WishlistItemType>) {

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
      deleteWishlistItemFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/wishlistItems`

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
      deleteWishlistItemFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update categories domain in state
       *
       *  - receive the updated data as response data
       *
       **/
      yield put(
        wishlistItemActions.clear()
      )


    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      log(response.message)

    }


  } else if (curAuth.userType === UserTypeEnum.GUEST) {

    /**
     * Guest User Type
     **/

    /**
     * delete the target entity from redux store
     **/
    yield put(
      wishlistItemActions.delete()
    )
  }
}




