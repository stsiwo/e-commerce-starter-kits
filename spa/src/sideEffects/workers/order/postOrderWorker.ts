import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { OrderCriteria } from "domain/order/types";
import { messageActions } from "reducers/slices/app";
import { postOrderFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { checkoutOrderActions } from "reducers/slices/domain/checkout";
import { PostOrderActionType } from "reducers/slices/domain/order";
import { stripeClientSecretActions } from "reducers/slices/sensitive";
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
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

  /**
   *
   * Admin User Type
   *
   **/
  if (
    curAuth.userType === UserTypeEnum.GUEST ||
    curAuth.userType === UserTypeEnum.MEMBER
  ) {
    /**
     * update status for post order data
     **/
    yield put(postOrderFetchStatusActions.update(FetchStatusEnum.FETCHING));

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/orders`;

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() =>
      api({
        method: "POST",
        url: apiUrl,
        data: action.payload as OrderCriteria,
      })
        .then((response) => ({
          fetchStatus: FetchStatusEnum.SUCCESS,
          order: response.data.order,
          clientSecret: response.data.clientSecret,
        }))
        .catch((e) => ({
          fetchStatus: FetchStatusEnum.FAILED,
          message: e.response.data.message,
        }))
    );

    /**
     * update fetch status sucess
     **/
    yield put(postOrderFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update this domain in state
       *
       * - NOTE: TO checkout/order (not domain/orders)
       *
       **/

      log("order and clientSecret in response");

      log(response);

      yield put(checkoutOrderActions.update(response.order));

      yield put(stripeClientSecretActions.update(response.clientSecret));

      /**
       * update fetch status sucess
       **/
      yield put(postOrderFetchStatusActions.update(FetchStatusEnum.SUCCESS));
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
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
  } else {
    log("permission denied. you are " + curAuth.userType);
  }
}
