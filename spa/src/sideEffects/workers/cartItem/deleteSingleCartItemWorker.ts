import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { CartItemType } from "domain/cart/types";
import { deleteSingleCartItemFetchStatusActions } from "reducers/slices/app/fetchStatus/cartItem";
import { cartItemActions } from "reducers/slices/domain/cartItem";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";

/**
 * a worker (generator)    
 *
 *  - delete single cart items of current user 
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
export function* deleteSingleCartItemWorker(action: PayloadAction<CartItemType>) {

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
      deleteSingleCartItemFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/cartItems/${action.payload.cartItemId}`

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
        cartItemActions.delete(action.payload)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        deleteSingleCartItemFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        deleteSingleCartItemFetchStatusActions.update(FetchStatusEnum.FAILED)
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
      cartItemActions.delete(action.payload)
    )
  }
}



