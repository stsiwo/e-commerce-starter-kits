import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { getOrderFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { orderActions } from "reducers/slices/domain/order";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);

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
    const apiUrl = `${API1_URL}/orders/${action.payload.orderId}`

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() => api({
      method: "GET",
      url: apiUrl,
    })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, data: response.data }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )
    /**
     * update fetch status sucess
     **/
    yield put(
      getOrderFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update order domain in state
       *
       **/
      yield put(
        orderActions.concat(response.data)
      )


    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      log(response.message)

    }
  } else {
    log("permission denied. your order type: " + curAuth.userType)
  }
}





