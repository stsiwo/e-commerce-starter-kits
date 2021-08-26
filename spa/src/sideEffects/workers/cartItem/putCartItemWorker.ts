import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { CartItemType } from "domain/cart/types";
import { putCartItemFetchStatusActions } from "reducers/slices/app/fetchStatus/cartItem";
import { cartItemActions } from "reducers/slices/domain/cartItem";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { logger } from "configs/logger";
const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - put cart items of current user
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): replace a existing entity with a new one
 *      - (Member): send api request to put a new data and assign response data to the redux saga
 *      - (Admin): N/A
 *
 *  - steps:
 *
 *      (Guest):
 *
 *        g1. update the new data to redux store
 *
 *      (Member):
 *
 *        m1. send put request to api to put a new data
 *
 *        m2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - keep the same id since it is replacement
 *
 **/
export function* putCartItemWorker(action: PayloadAction<CartItemType>) {
  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

  /**
   *
   * Member User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.MEMBER) {
    /**
     * update status for anime data
     **/
    yield put(putCartItemFetchStatusActions.update(FetchStatusEnum.FETCHING));

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
        method: "PUT",
        url: apiUrl,
        data: action.payload,
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
    yield put(putCartItemFetchStatusActions.update(FetchStatusEnum.SUCCESS));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update categories domain in state
       *
       *  - receive the updated data as response data
       *
       **/
      yield put(cartItemActions.updateOne(response.data));
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);
    }
  } else if (curAuth.userType === UserTypeEnum.GUEST) {
    /**
     * Guest User Type
     **/

    /**
     * update categories domain in state
     *
     *  - receive the newly added data as response data
     *
     **/
    yield put(cartItemActions.updateOne(action.payload));
  }
}
