import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { appConfig } from "configs/appConfig";
import { getOrderFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { orderActions } from "reducers/slices/domain/order";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";

/**
 * a worker (generator)    
 *
 *  - fetch this single domain 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (OrderType)
 *
 *      - (Guest): N/A  
 *      - (Member): N/A 
 *      - (Admin): send get request and receive this single domain and save it to redux store 
 *
 *  - steps:
 *
 *      (Admin): 
 *
 *        a1. send fetch request to api to grab data
 *
 *        a2. receive the response and save it to redux store
 *  
 **/
export function* fetchSingleOrderWorker(action: PayloadAction<{ orderId: string }>) {

  /**
   * get cur user type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)


  if (curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for anime data
     **/
    yield put(
      getOrderFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${appConfig.baseUrl}/orders/${action.payload.orderId}`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(axios, {
        method: "GET",
        url: apiUrl,
      })

      /**
       * update order domain in state
       *
       **/
      yield put(
        orderActions.merge(response.data.data)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        getOrderFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        getOrderFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  } else {
    console.log("permission denied. your order type: " + curAuth.userType)
  }
}





