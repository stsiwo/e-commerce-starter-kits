import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import {
  authActions,
  messageActions,
  PatchAuthPhoneActionType,
} from "reducers/slices/app";
import { patchAuthPhoneFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
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
 *  - patch auth (its own) data (not others)
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
 *  - note:
 *
 *    - userId always refers to auth userid
 *
 *      - don't refer to other userId
 *
 **/
export function* patchAuthPhoneWorker(
  action: PayloadAction<PatchAuthPhoneActionType>
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
      patchAuthPhoneFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/phones/${action.payload.phoneId}`;

    /**
     * fetch data
     **/
    // prep keyword if necessary

    // start fetching
    const response: WorkerResponse = yield call(() =>
      api({
        method: "PATCH",
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
    yield put(patchAuthPhoneFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update this domain in state
       *
       **/
      yield put(authActions.replacePhone(response.data));

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "switched primary successfully.",
        })
      );
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);
    }
  } else if (curAuth.userType === UserTypeEnum.GUEST) {
    yield put(
      authActions.switchPrimaryPhone({
        phoneId: action.payload.phoneId,
      })
    );
  }
}
