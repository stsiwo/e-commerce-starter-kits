import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { CartItemType } from "domain/cart/types";
import { postCartItemFetchStatusActions } from "reducers/slices/app/fetchStatus/cartItem";
import { cartItemActions } from "reducers/slices/domain/cartItem";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getUuidv4 } from "src/utils";

const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - post cart items of current user
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): add a new data to redux saga
 *      - (Member): send api request to post a new data and assign response data to the redux saga
 *      - (Admin): N/A
 *
 *  - steps:
 *
 *      (Guest):
 *
 *        g1. save the new data to redux store
 *
 *      (Member):
 *
 *        m1. send post request to api to post a new data
 *
 *        m2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - payload (e.g., CartItemType) does not have any id yet.
 *
 *      (Guest):
 *
 *        - need to assign the id temporarly (e.g., int, uuidv4). the id is not kept when the user create an account (e.g., member)
 *
 *      (Member):
 *
 *        - don't need to assign the id. the back-end takes care of that.
 *
 **/
export function* postCartItemWorker(action: PayloadAction<CartItemType>) {
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
    yield put(postCartItemFetchStatusActions.update(FetchStatusEnum.FETCHING));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/cartItems`;

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response: WorkerResponse = yield call(() =>
      api({
        method: "POST",
        url: apiUrl,
        headers: { "If-Match": `"${action.payload.version}"` },
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
    yield put(postCartItemFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update categories domain in state
       *
       *  - receive the newly added data as response data
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
     * create temp id and assign it to the new entity
     **/
    const tempId = getUuidv4();
    const newEntity = action.payload;
    newEntity.cartItemId = tempId;

    /**
     * update categories domain in state
     *
     *  - receive the newly added data as response data
     *
     **/
    yield put(cartItemActions.updateOne(newEntity));
  }
}
