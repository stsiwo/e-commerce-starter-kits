import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { authActions, DeleteAuthAvatarImageActionType, messageActions } from "reducers/slices/app";
import { deleteAuthAvatarImageFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);
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
export function* deleteAuthAvatarImageWorker(action: PayloadAction<DeleteAuthAvatarImageActionType>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  /**
   *
   * Admin User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.ADMIN || curAuth.userType === UserTypeEnum.MEMBER) {

    /**
     * update status for put user data
     **/
    yield put(
      deleteAuthAvatarImageFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/avatar-image`

    /**
     * fetch data
     **/

      // start fetching
      const response = yield call(() => api({
        method: "DELETE",
        url: apiUrl,
      })
        .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS }))
        .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        deleteAuthAvatarImageFetchStatusActions.update(response.fetchStatus)
      )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {

      /**
       * update this domain in state
       *
       **/
      yield put(
        authActions.updateAvatarImagePath("")
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "deleted successfully.",
        })
      )
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      log(response.message)

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: response.message
        })
      )
    }
  } else {
    log("permission defined: you are " + curAuth.userType)
  }
}






