import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { UserType } from "domain/user/types";
import { putUserFetchStatusActions, postAvatarImageFetchStatusActions } from "reducers/slices/app/fetchStatus/user";
import { userActions, PostAvatarImageActionType } from "reducers/slices/domain/user";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum, MessageTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { messageActions, authActions } from "reducers/slices/app";
import { getNanoId } from "src/utils";

/**
 * a worker (generator)    
 *
 *  - post user avatar image 
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
 *    - does not necessary auth user upload its own avatar image (e.g., admin might update other avatar image) 
 *
 *      - use input 'userId' and don't use auth's userId.
 *
 **/
export function* postAvatarImageWorker(action: PayloadAction<PostAvatarImageActionType>) {

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
      postAvatarImageFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}/avatar-image`

    /**
     * fetch data
     **/
    try {

      // prep form data
      const formData = new FormData();
      formData.append("avatarImage", action.payload.avatarImage)

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "POST",
        url: apiUrl,
        data: formData, 
        headers: { "Content-Type": "multipart/form-data" },
      })

      /**
       * update this domain in state
       *
       **/
      yield put(
        authActions.updateAvatarImagePath(response.data.imagePath)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        postAvatarImageFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
        putUserFetchStatusActions.update(FetchStatusEnum.FAILED)
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
    console.log("permission defined: you are " + curAuth.userType)
  }
}





