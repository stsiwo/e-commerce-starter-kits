import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { CartItemType } from "domain/cart/types";
import { deleteCartItemFetchStatusActions } from "reducers/slices/app/fetchStatus/cartItem";
import { cartItemActions } from "reducers/slices/domain/cartItem";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);

/**
 * a worker (generator)    
 *
 *  - delete all cart items of current user 
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
export function* deleteCartItemWorker(action: PayloadAction<CartItemType>) {

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
      deleteCartItemFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/cartItems`

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
      deleteCartItemFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {

      /**
       * update categories domain in state
       *
       *  - receive the updated data as response data
       *
       **/
      yield put(
        cartItemActions.clear()
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
      cartItemActions.delete()
    )
  }
}



