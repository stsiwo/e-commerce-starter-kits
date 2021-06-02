import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { OrderType, OrderCriteria } from "domain/order/types";
import { postOrderFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { orderActions, PostOrderActionType } from "reducers/slices/domain/order";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum, MessageTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { messageActions } from "reducers/slices/app";
import { getNanoId } from "src/utils";
import { stripeClientSecretActions } from "reducers/slices/sensitive";

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
export function* postOrderWorker(action: PayloadAction<PostOrderActionType>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  /**
   *
   * Admin User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.GUEST || curAuth.userType === UserTypeEnum.MEMBER) {

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
        method: "POST",
        url: apiUrl,
        data: action.payload as OrderCriteria
      })

      /**
       * update this domain in state
       *
       **/
      yield put(
        orderActions.concat(response.data.order)
      )

      yield put(
        stripeClientSecretActions.update(response.data.clientSecret)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        postOrderFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "we confirmed your request.",
        }) 
      )
    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        postOrderFetchStatusActions.update(FetchStatusEnum.FAILED)
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
  } else {
    console.log("permission denied. you are " + curAuth.userType)
  }
}






