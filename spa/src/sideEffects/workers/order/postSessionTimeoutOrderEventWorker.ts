import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { SessionTimeoutOrderEventCriteria } from "domain/order/types";
import { messageActions } from "reducers/slices/app";
import { postSessionTimeoutOrderEventFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { checkoutOrderActions } from "reducers/slices/domain/checkout";
import { PostSessionTimeoutOrderEventActionType } from "reducers/slices/domain/order";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";

/**
 * a worker (generator)    
 *
 *  - delete single order event 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
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
 *        a1. send delete request to api to delete the target entity 
 *
 *        a2. receive the response and delete it from redux store if success
 *
 *  - note:
 *
 **/
export function* postSessionTimeoutOrderEventWorker(action: PayloadAction<PostSessionTimeoutOrderEventActionType>) {

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
     * update status for put product data
     **/
    yield put(
      postSessionTimeoutOrderEventFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this domain
     **/
    const apiUrl = `${API1_URL}/orders/${action.payload.orderId}/events/session-timeout`

    /**
     * fetch data
     **/

    // start fetching
    const response = yield call(() => api({
      method: "POST",
      url: apiUrl,
      data: {
        orderNumber: action.payload.orderNumber
      } as SessionTimeoutOrderEventCriteria
    })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, data: response.data }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )

    /**
     * update fetch status sucess
     **/
    yield put(
      postSessionTimeoutOrderEventFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update product domain in state
       *
       **/
      yield put(
        checkoutOrderActions.update(response.data)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: "sorry, your session is timeout. please start over again.",
        })
      )
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

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
  } else {
    console.log("permission denied. you are " + curAuth.userType)
  }
}


