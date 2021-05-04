import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { OrderType } from "domain/order/types";
import { postOrderFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { orderActions } from "reducers/slices/domain/order";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";

/**
 * a worker (generator)    
 *
 *  - post this domain to create new
 *
 *  - NOT gonna use caching since it might be stale soon and the order can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): send post request to create new and receive data from api and save it to redux store
 *      - (Member): send post request to create new and receive data from api and save it to redux store
 *      - (Admin): OK 
 *
 *  - steps:
 *
 *      (Guest & Member): 
 *
 *        a1. send post request to api to post a new data 
 *
 *        a2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - this domain does not have its id yet.
 *
 *    - dont' send back the sensitive information about this order
 *
 **/
export function* postOrderWorker(action: PayloadAction<OrderType>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  /**
   *
   * Admin User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for post order data
     **/
    yield put(
      postOrderFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/orders`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "PUT",
        url: apiUrl,
        data: action.payload
      })

      /**
       * update this domain in state
       *
       **/
      yield put(
        orderActions.merge(response.data.data)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        postOrderFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        postOrderFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  } 
}






