import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import {
  authActions,
  messageActions,
  PostAuthAvatarImageActionType,
} from "reducers/slices/app";
import { postAuthAvatarImageFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
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
 *  - post user avatar image
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): N/A (permission denied)
 *      - (Member): OK
 *      - (Admin): OK
 *
 *  - steps:
 *
 *
 *  - note:
 *
 *    - userId always refers to auth userid
 *
 *      - don't refer to other userId
 *
 **/
export function* postAuthAvatarImageWorker(
  action: PayloadAction<PostAuthAvatarImageActionType>
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
  if (
    curAuth.userType === UserTypeEnum.ADMIN ||
    curAuth.userType === UserTypeEnum.MEMBER
  ) {
    /**
     * update status for put user data
     **/
    yield put(
      postAuthAvatarImageFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/avatar-image`;

    /**
     * fetch data
     **/

    // prep form data
    const formData = new FormData();
    formData.append("avatarImage", action.payload.avatarImage);

    // start fetching
    const response: WorkerResponse = yield call(() =>
      api({
        method: "POST",
        url: apiUrl,
        headers: {
          "If-Match": `"${action.payload.version}"`,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((response) => ({
          fetchStatus: FetchStatusEnum.SUCCESS,
          user: response.data,
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
      postAuthAvatarImageFetchStatusActions.update(response.fetchStatus)
    );

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update this domain in state
       *
       **/
      yield put(authActions.updateUser(response.user));

      /**
       * udpate version for this user otherwise, consecutive request return version mismatch error.
       */

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "added successfully.",
        })
      );
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);
    }
  } else {
    log("permission defined: you are " + curAuth.userType);
  }
}
