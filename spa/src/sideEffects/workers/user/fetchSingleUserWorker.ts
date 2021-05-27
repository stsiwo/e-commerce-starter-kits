import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { getUserFetchStatusActions } from "reducers/slices/app/fetchStatus/user";
import { userActions } from "reducers/slices/domain/user";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { api } from "configs/axiosConfig";

/**
 * a worker (generator)    
 *
 *  - fetch single user items of current user 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): N/A (permission denied) 
 *      - (Member): N/A (permission denied) 
 *      - (Admin): send fetch request and receive data and save it  to redux store
 *
 *  - steps:
 *
 *      (Admin): 
 *
 *        a1. send fetch request to api to grab data
 *
 *        a2. receive the response and save it to redux store
 *  
 **/
export function* fetchSingleUserWorker(action: PayloadAction<{ userId: string }>) {

  /**
   * get cur user type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)


  if (curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for anime data
     **/
    yield put(
      getUserFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab single domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "GET",
        url: apiUrl,
      })

      /**
       * update user domain in state
       *
       **/
      yield put(
        userActions.concat([response.data])
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        getUserFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        getUserFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  } else {
    console.log("permission denied. your user type: " + curAuth.userType)
  }
}




