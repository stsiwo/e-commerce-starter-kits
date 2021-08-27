import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { messageActions } from "reducers/slices/app";
import { patchNotificationFetchStatusActions } from "reducers/slices/app/fetchStatus/notification";
import {
  notificationActions,
  PatchNotificationActionType,
} from "reducers/slices/domain/notification";
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
 *  - patch this domain to replace
 *
 *  - NOT gonna use caching since it might be stale soon and the notification can update any time.
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
 *        a1. send patch request to api to patch a new data
 *
 *        a2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - keep the same id since it is replacement
 *
 **/
export function* patchNotificationWorker(
  action: PayloadAction<PatchNotificationActionType>
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
     * update status for patch notification data
     **/
    yield put(
      patchNotificationFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}/notifications/${action.payload.notificationId}`;

    // start fetching
    const response: WorkerResponse = yield call(() =>
      api({
        method: "PATCH",
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
    yield put(patchNotificationFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update notification domain in state
       *
       **/
      yield put(
        // be careful when normalized a single object, you need to append its domain name (plural) to 'entities'
        notificationActions.updateOne(response.data)
      );

      /**
       * update message
       **/
      //yield put(
      //  messageActions.update({
      //    id: getNanoId(),
      //    type: MessageTypeEnum.SUCCESS,
      //    message: "updated successfully.",
      //  })
      //)
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);

      /**
       * update fetch status failed
       **/
      yield put(
        patchNotificationFetchStatusActions.update(FetchStatusEnum.FAILED)
      );

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
  }
}
