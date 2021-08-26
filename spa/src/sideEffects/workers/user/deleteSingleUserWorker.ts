import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { UserType } from "domain/user/types";
import { deleteSingleUserFetchStatusActions } from "reducers/slices/app/fetchStatus/user";
import { userActions } from "reducers/slices/domain/user";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { logger } from "configs/logger";
const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - delete single user items
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
export function* deleteSingleUserWorker(action: PayloadAction<UserType>) {
  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

  /**
   *
   * Admin User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.ADMIN) {
    /**
     * update status for anime data
     **/
    yield put(
      deleteSingleUserFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/categories/${action.payload.userId}`;

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() =>
      api({
        method: "DELETE",
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
      deleteSingleUserFetchStatusActions.update(FetchStatusEnum.SUCCESS)
    );

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update categories domain in state
       *
       **/
      yield put(userActions.delete(action.payload));
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);
    }
  }
}
