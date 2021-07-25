import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { UserType } from "domain/user/types";
import { patchUserFetchStatusActions } from "reducers/slices/app/fetchStatus/user";
import { userActions } from "reducers/slices/domain/user";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);

/**
 * a worker (generator)    
 *
 *  - patch (temporarly delete) this domain 
 *
 *    - only update 'isDeleted' property to true in user table
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
 *        a1. send patch request to api to delete it temporary 
 *
 *        a2. receive the response and delete it from redux store 
 *
 *  - note:
 *
 *
 **/
export function* patchUserWorker(action: PayloadAction<UserType>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  /**
   *
   * Member User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for anime data
     **/
    yield put(
      patchUserFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}`

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() => api({
      method: "PATCH",
      url: apiUrl,
      // TODO: make sure backend
      data: {
        isDeleted: true,
        deletedAccountDate: new Date().toString(),
      }
    })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, data: response.data }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )

    /**
     * update fetch status sucess
     **/
    yield put(
      patchUserFetchStatusActions.update(response.fetchStatus)
    )


    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update categories domain in state
       *
       **/
      yield put(
        userActions.delete(action.payload)
      )


    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      log(response.message)

    }
  }
}




