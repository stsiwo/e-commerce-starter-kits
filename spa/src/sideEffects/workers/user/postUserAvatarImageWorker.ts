import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { messageActions } from "reducers/slices/app";
import { postUserAvatarImageFetchStatusActions } from "reducers/slices/app/fetchStatus/user";
import { PostUserAvatarImageActionType } from "reducers/slices/domain/user";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
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
 *    - this is to update other's avatar image (not for your own like auth)
 *
 **/
export function* postUserAvatarImageWorker(action: PayloadAction<PostUserAvatarImageActionType>) {

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
      postUserAvatarImageFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}/avatar-image`

    /**
     * fetch data
     **/

    // prep form data
    const formData = new FormData();
    formData.append("avatarImage", action.payload.avatarImage)

    // start fetching
    const response = yield call(() => api({
      method: "POST",
      url: apiUrl,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, data: response.data }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )
    /**
     * update fetch status sucess
     **/
    yield put(
      postUserAvatarImageFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {

      /**
       * update this domain in state
       *
       **/

      // TODO: fix this at admin customer
      //yield put(
      //  userActions.update(response.data.imagePath)
      //)

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

      console.log(response.message)

      /**
       * update fetch status failed
       **/
      yield put(
        postUserAvatarImageFetchStatusActions.update(FetchStatusEnum.FAILED)
      )

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
    console.log("permission defined: you are " + curAuth.userType)
  }
}





