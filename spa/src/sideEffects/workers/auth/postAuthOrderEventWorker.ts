import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { messageActions, FetchAuthOrderActionType, PostAuthOrderEventActionType } from "reducers/slices/app";
import { all, call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { generateQueryString, getNanoId } from "src/utils";
import { fetchAuthOrderFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
import { orderActions, orderPaginationPageActions, orderPaginationTotalPagesActions, orderPaginationTotalElementsActions } from "reducers/slices/domain/order";
import { postOrderEventFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { OrderEventCriteria } from "domain/order/types";

/**
 * a worker (generator)    
 *
 *  - fetch wishlist items of current user 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): N/A 
 *      - (Member): send api request to grab data
 *      - (Admin): N/A
 *
 *  - steps:
 *
 *      (Member): 
 *
 *        m1. send fetch request to api to grab data
 *
 *        m2. receive the response and save it to redux store
 *  
 **/
export function* postAuthOrderEventWorker(action: PayloadAction<PostAuthOrderEventActionType>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)


  if (curAuth.userType === UserTypeEnum.MEMBER) {

    /**
     * update status for anime data
     **/
    yield put(
      postOrderEventFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )
    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}/orders/${action.payload.orderId}/events`

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() => api({
      method: "POST",
      url: apiUrl,
      data: {
        orderStatus: action.payload.orderStatus,
        note: action.payload.note,
        userId: action.payload.userId
      } as OrderEventCriteria
    })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, data: response.data }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )

    /**
     * update fetch status sucess
     **/
    yield put(
      postOrderEventFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update domain in state
       *
       * don't use 'merge' since no cache
       **/
      console.log("order dto in resposne")
      console.log(response.data)
      yield put(
        orderActions.updateOne(response.data)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "we received your request." 
        })
      )

    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      console.log(response.message)

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: response.message
        })
      )
    }
  }
}


