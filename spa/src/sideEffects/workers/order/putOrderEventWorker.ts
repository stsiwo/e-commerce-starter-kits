import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { OrderEventCriteria } from "domain/order/types";
import { messageActions } from "reducers/slices/app";
import { putOrderEventFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { orderActions, PutOrderEventActionType } from "reducers/slices/domain/order";
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
export function* putOrderEventWorker(action: PayloadAction<PutOrderEventActionType>) {

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
     * update status for put product data
     **/
    yield put(
      putOrderEventFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this domain
     **/
    const apiUrl = `${API1_URL}/orders/${action.payload.orderId}/events/${action.payload.orderEventId}`

    /**
     * fetch data
     **/

    // start fetching
    const response = yield call(() => api({
      method: "PUT",
      url: apiUrl,
      data: {
        orderEventId: action.payload.orderEventId,
        note: action.payload.note,
        userId: curAuth.user.userId,
      } as OrderEventCriteria
    })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, data: response.data }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )

    /**
     * update fetch status sucess
     **/
    yield put(
      putOrderEventFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update product domain in state
       *
       **/

      console.log("response from PUT order event update.")
      console.log(response.data)

      yield put(
        orderActions.updateEvent({
          orderId: action.payload.orderId,
          event: response.data
        })
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "updated successfully.",
        })
      )
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      console.log(response.fetchStatus)

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: response.fetchStatus
        })
      )
    }
  }
}


