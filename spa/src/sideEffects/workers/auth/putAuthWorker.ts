import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { UserCriteria } from "domain/user/types";
import { authActions, PutAuthActionType, messageActions } from "reducers/slices/app";
import { putAuthFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum, MessageTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";

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
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "PUT",
        url: apiUrl,
        data: action.payload as UserCriteria
      })

      /**
       * update this domain in state
       *
       **/
      yield put(
        authActions.update({
          ...curAuth,
          user: response.data.data
        })
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        putAuthFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        putAuthFetchStatusActions.update(FetchStatusEnum.FAILED)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: error.message, 
        }) 
      )
    }
  } else {
    console.log("permission denied: you are " + curAuth.userType)
  }
}





