import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { getCartItemFetchStatusActions } from "reducers/slices/app/fetchStatus/cartItem";
import { cartItemActions } from "reducers/slices/domain/cartItem";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { logger } from "configs/logger";
const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - fetch cart items of current user
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
export function* fetchCartItemWorker(action: PayloadAction<{}>) {
  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

  if (curAuth.userType === UserTypeEnum.MEMBER) {
    /**
     * update status for anime data
     **/
    yield put(getCartItemFetchStatusActions.update(FetchStatusEnum.FETCHING));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/cartItems`;

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
    yield put(getCartItemFetchStatusActions.update(FetchStatusEnum.SUCCESS));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update cartItem domain in state
       *
       **/
      log("recived cart items from api");
      log(response.data); // no pagination, use response.data.
      yield put(cartItemActions.update(response.data));
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);
    }
  }
}
