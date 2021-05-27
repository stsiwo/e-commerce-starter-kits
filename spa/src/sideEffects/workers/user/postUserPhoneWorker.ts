import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { UserPhoneCriteria } from "domain/user/types";
import { messageActions } from "reducers/slices/app";
import { postUserPhoneFetchStatusActions } from "reducers/slices/app/fetchStatus/user";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { PostUserPhoneActionType, userActions } from "reducers/slices/domain/user";

/**
 * a worker (generator)    
 *
 *  - put user (its own) data (not others) 
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
 *    - userId always refers to the other member's userid 
 *
 *
 **/
export function* postUserPhoneWorker(action: PayloadAction<PostUserPhoneActionType>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

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
      postUserPhoneFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}/phones`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "POST",
        url: apiUrl,
        data: {
          phoneNumber: action.payload.phoneNumber, 
          countryCode: action.payload.countryCode,
          isSelected: action.payload.isSelected,
        } as UserPhoneCriteria
      })

      /**
       * update this domain in state
       *
       **/
      console.log("added phone from response")
      console.log(response.data)
      yield put(
        userActions.appendPhone({
          phone: response.data,
          userId: action.payload.userId,
        })
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        postUserPhoneFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
        postUserPhoneFetchStatusActions.update(FetchStatusEnum.FAILED)
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






