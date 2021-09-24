import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { UserPhoneCriteria } from "domain/user/types";
import {
  authActions,
  messageActions,
  PutAuthPhoneActionType,
} from "reducers/slices/app";
import { putAuthPhoneFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
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
 *  - put auth (its own) data (not others)
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
export function* putAuthPhoneWorker(
  action: PayloadAction<PutAuthPhoneActionType>
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
    yield put(putAuthPhoneFetchStatusActions.update(FetchStatusEnum.FETCHING));

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
        method: "PUT",
        url: apiUrl,
        headers: { "If-Match": `"${action.payload.version}"` },
        data: {
          phoneId: action.payload.phoneId,
          phoneNumber: action.payload.phoneNumber,
          countryCode: action.payload.countryCode,
          isSelected: action.payload.isSelected,
        } as UserPhoneCriteria,
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
    yield put(putAuthPhoneFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update this domain in state
       *
       **/
      yield put(authActions.updatePhone(response.data));

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
  } else if (curAuth.userType === UserTypeEnum.GUEST) {
    /**
     * update auth only redux store
     **/
    yield put(authActions.updatePhone(action.payload));
  }
}
