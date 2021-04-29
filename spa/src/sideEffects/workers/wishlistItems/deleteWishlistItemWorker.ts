import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { WishlistItemType } from "domain/wishlist/types";
import { wishlistItemActions } from "reducers/slices/domain/wishlistItem";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { deleteWishlistItemFetchStatusActions } from "reducers/slices/app/fetchStatus/wishlistItem";

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
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(axios, {
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
        wishlistItemActions.clear()
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        deleteWishlistItemFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        deleteWishlistItemFetchStatusActions.update(FetchStatusEnum.FAILED)
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
      wishlistItemActions.delete()
    )
  }
}




