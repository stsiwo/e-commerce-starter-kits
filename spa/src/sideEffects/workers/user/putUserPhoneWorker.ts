import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { UserPhoneCriteria } from "domain/user/types";
import { authActions, messageActions, PutAuthPhoneActionType } from "reducers/slices/app";
import { putAuthPhoneFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { PutUserPhoneActionType, userActions } from "reducers/slices/domain/user";
import { putUserPhoneFetchStatusActions } from "reducers/slices/app/fetchStatus/user";

/**
 * a worker (generator)    
 *
 *  - put user's phone of the other member (not for auth) 
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
 *    - userId: the other member
 *
 **/
export function* putUserPhoneWorker(action: PayloadAction<PutUserPhoneActionType>) {

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
      putUserPhoneFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}/phones/${action.payload.phoneId}`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "PUT",
        url: apiUrl,
        data: {
          phoneNumber: action.payload.phoneNumber,
          countryCode: action.payload.countryCode,
          isSelected: action.payload.isSelected,
          phoneId: action.payload.phoneId
        } as UserPhoneCriteria
      })

      /**
       * update this domain in state
       *
       **/
      yield put(
        userActions.updatePhone({
          phone: response.data,
          userId: action.payload.userId,
        })
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        putUserPhoneFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "updated successfully.",
        }) 
      )

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        putUserPhoneFetchStatusActions.update(FetchStatusEnum.FAILED)
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






