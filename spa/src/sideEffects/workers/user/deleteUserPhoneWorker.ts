import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { messageActions } from "reducers/slices/app";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { DeleteUserPhoneActionType, userActions } from "reducers/slices/domain/user";
import { deleteUserPhoneFetchStatusActions } from "reducers/slices/app/fetchStatus/user";

/**
 * a worker (generator)    
 *
 *  - delete the other memebr's phone 
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
 *    - userId always refers to other member's userid 
 *
 **/
export function* deleteUserPhoneWorker(action: PayloadAction<DeleteUserPhoneActionType>) {

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
     * update status for delete user data
     **/
    yield put(
      deleteUserPhoneFetchStatusActions.update(FetchStatusEnum.FETCHING)
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
        method: "DELETE",
        url: apiUrl,
      })

      /**
       * update this domain in state
       *
       **/
      yield put(
        userActions.removePhone({ 
          phoneId : action.payload.phoneId,
          userId: action.payload.userId
        })
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        deleteUserPhoneFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        deleteUserPhoneFetchStatusActions.update(FetchStatusEnum.FAILED)
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






