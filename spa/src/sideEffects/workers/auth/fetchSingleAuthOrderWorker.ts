import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import {
  FetchSingleAuthOrderActionType,
  messageActions,
} from "reducers/slices/app";
import { fetchSingleAuthOrderFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
import { orderActions } from "reducers/slices/domain/order";
import { call, put, select } from "redux-saga/effects";
import {
  AuthType,
  FetchStatusEnum,
  MessageTypeEnum,
  UserTypeEnum,
} from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { logger } from "configs/logger";
const log = logger(__filename);
/**
 * a worker (generator)
 *
 *  - fetchSingle wishlist items of current user
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
 *        m1. send fetchSingle request to api to grab data
 *
 *        m2. receive the response and save it to redux store
 *
 **/
export function* fetchSingleAuthOrderWorker(
  action: PayloadAction<FetchSingleAuthOrderActionType>
) {
  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

  if (curAuth.userType === UserTypeEnum.MEMBER) {
    /**
     * update status for anime data
     **/
    yield put(
      fetchSingleAuthOrderFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );
    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}/orders/${action.payload.orderId}`;

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() =>
      api({
        method: "GET",
        url: apiUrl,
      })
        .then((response) => ({
          fetchStatus: FetchStatusEnum.SUCCESS,
          data: response.data,
        }))
        .catch((e) => ({
          fetchStatus: FetchStatusEnum.FAILED,
          message: e.response.data.message,
        }))
    );

    /**
     * update fetch status sucess
     **/
    yield put(
      fetchSingleAuthOrderFetchStatusActions.update(response.fetchStatus)
    );

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update domain in state
       *
       * don't use 'merge' since no cache
       **/
      log("auth order item dto response data");
      log(response.data);
      yield put(orderActions.update([response.data]));
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: response.message,
        })
      );
    }
  }
}
