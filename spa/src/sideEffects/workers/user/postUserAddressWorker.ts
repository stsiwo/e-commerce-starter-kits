import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { UserAddressCriteria } from "domain/user/types";
import { messageActions } from "reducers/slices/app";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { PostUserAddressActionType, userActions } from "reducers/slices/domain/user";
import { postUserAddressFetchStatusActions } from "reducers/slices/app/fetchStatus/user";

/**
 * a worker (generator)    
 *
 *  - post the other user's address 
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
export function* postUserAddressWorker(action: PayloadAction<PostUserAddressActionType>) {

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
      postUserAddressFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}/addresses`

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
          address1: action.payload.address1,
          address2: action.payload.address2,
          city: action.payload.city,
          province: action.payload.province,
          country: action.payload.country,
          postalCode: action.payload.postalCode,
          isBillingAddress: action.payload.isBillingAddress,
          isShippingAddress: action.payload.isShippingAddress,
        } as UserAddressCriteria
      })

      /**
       * update this domain in state
       *
       **/
      console.log("added address from response")
      console.log(response.data)
      yield put(
        userActions.appendAddress({
          address: response.data,
          userId: action.payload.userId,
        })
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        postUserAddressFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
        postUserAddressFetchStatusActions.update(FetchStatusEnum.FAILED)
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






