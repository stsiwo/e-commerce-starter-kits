import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { OrderType } from "domain/order/types";
import { putOrderFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { orderActions } from "reducers/slices/domain/order";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";

/**
 * a worker (generator)    
 *
 *  - put this domain to replace
 *
 *  - NOT gonna use caching since it might be stale soon and the order can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): N/A (permission denied) 
 *      - (Member): N/A (permission denied) 
 *      - (Admin): OK 
 *
 *  - steps:
 *
 *      (Admin): 
 *
 *        a1. send put request to api to put a new data 
 *
 *        a2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - keep the same id since it is replacement 
 *
 **/
export function* putOrderWorker(action: PayloadAction<OrderType>) {

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
     * update status for put order data
     **/
    yield put(
      putOrderFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/orders/${action.payload.orderId}`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(axios, {
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
        putOrderFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        putOrderFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  } 
}




