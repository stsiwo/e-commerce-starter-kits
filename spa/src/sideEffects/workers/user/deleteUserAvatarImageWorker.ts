import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { messageActions } from "reducers/slices/app";
import { deleteUserAvatarImageFetchStatusActions } from "reducers/slices/app/fetchStatus/user";
import {
  DeleteUserAvatarImageActionType,
  userActions,
} from "reducers/slices/domain/user";
import { call, put, select } from "redux-saga/effects";
import {
  AuthType,
  FetchStatusEnum,
  MessageTypeEnum,
  UserTypeEnum,
} from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";

const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - delete user avatar image
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
 *
 *  - note:
 *
 *    - this is to update other's avatar image (not for your own like auth)
 *
 *
 **/
export function* deleteUserAvatarImageWorker(
  action: PayloadAction<DeleteUserAvatarImageActionType>
) {
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
     * update status for put user data
     **/
    yield put(
      deleteUserAvatarImageFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}/avatar-image`;

    /**
     * fetch data
     **/

    // start fetching
    const response: WorkerResponse = yield call(() =>
      api({
        method: "DELETE",
        headers: { "If-Match": `"${action.payload.version}"` },
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
      deleteUserAvatarImageFetchStatusActions.update(response.fetchStatus)
    );
    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      yield put(
        userActions.updateUser({
          userId: response.data.userId,
          user: response.data,
        })
      );

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "deleted successfully.",
        })
      );
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);

      /**
       * update fetch status failed
       **/
      yield put(
        deleteUserAvatarImageFetchStatusActions.update(FetchStatusEnum.FAILED)
      );
    }
  } else {
    log("permission defined: you are " + curAuth.userType);
  }
}
