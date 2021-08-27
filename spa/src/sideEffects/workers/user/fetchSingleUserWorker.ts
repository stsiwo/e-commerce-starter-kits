import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { getUserFetchStatusActions } from "reducers/slices/app/fetchStatus/user";
import { userActions } from "reducers/slices/domain/user";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";

const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - fetch single user items of current user
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): N/A (permission denied)
 *      - (Member): N/A (permission denied)
 *      - (Admin): send fetch request and receive data and save it  to redux store
 *
 *  - steps:
 *
 *      (Admin):
 *
 *        a1. send fetch request to api to grab data
 *
 *        a2. receive the response and save it to redux store
 *
 **/
export function* fetchSingleUserWorker(
  action: PayloadAction<{ userId: string }>
) {
  /**
   * get cur user type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

  if (curAuth.userType === UserTypeEnum.ADMIN) {
    /**
     * update status for anime data
     **/
    yield put(getUserFetchStatusActions.update(FetchStatusEnum.FETCHING));

    /**
     * grab single domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}`;

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response: WorkerResponse = yield call(() =>
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
    yield put(getUserFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update user domain in state
       *
       **/
      yield put(userActions.concat([response.data]));
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);
    }
  } else {
    log("permission denied. your user type: " + curAuth.userType);
  }
}
