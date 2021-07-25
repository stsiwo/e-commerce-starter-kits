import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { UserCriteria } from "domain/user/types";
import { authActions, messageActions, PutAuthActionType } from "reducers/slices/app";
import { putAuthFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);

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
export function* putAuthWorker(action: PayloadAction<PutAuthActionType>) {

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
      putAuthFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}`

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() => api({
      method: "PUT",
      url: apiUrl,
      data: action.payload as UserCriteria
    })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, data: response.data }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )
    /**
     * update fetch status sucess
     **/
    yield put(
      putAuthFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {

      /**
       * update this domain in state
       *
       **/
      yield put(
        authActions.update({
          ...curAuth,
          user: response.data
        })
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "added successfully.",
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
  } else if (curAuth.userType === UserTypeEnum.GUEST) {

    yield put(
      authActions.update({
        ...curAuth,
        user: {
          ...curAuth.user,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
        },
      })
    );

  }
}





