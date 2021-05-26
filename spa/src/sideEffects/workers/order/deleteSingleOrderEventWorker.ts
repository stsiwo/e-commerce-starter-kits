import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { messageActions } from "reducers/slices/app";
import { deleteSingleOrderEventFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { DeleteSingleOrderEventActionType, orderActions } from "reducers/slices/domain/order";
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
export function* deleteSingleOrderEventWorker(action: PayloadAction<DeleteSingleOrderEventActionType>) {

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
      deleteSingleOrderEventFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this domain
     **/
    const apiUrl = `${API1_URL}/orders/${action.payload.orderId}/events/${action.payload.orderEventId}`

    /**
     * fetch data
     **/
    try {

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "DELETE",
        url: apiUrl,
      })

      /**
       * update product domain in state
       *
       * NOTE: be careful. this is different from usually 'delete' response.
       *
       *  - we received OrderDTO from the api and replace with old one since deleting an order event affects the other properties of the order.
       *
       **/
      yield put(
        orderActions.replace({
          order: response.data,
          orderId: action.payload.orderId
        })
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        deleteSingleOrderEventFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "deleted successfully.",
        }) 
      )
    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        deleteSingleOrderEventFetchStatusActions.update(FetchStatusEnum.FAILED)
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
  } 
}


