import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { UserAddressCriteria } from "domain/user/types";
import { messageActions } from "reducers/slices/app";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { PutUserAddressActionType, userActions } from "reducers/slices/domain/user";
import { putUserAddressFetchStatusActions } from "reducers/slices/app/fetchStatus/user";

/**
 * a worker (generator)    
 *
 *  - put the other member's address 
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
 *    - userId always refers to the other member's userId 
 *
 **/
export function* putUserAddressWorker(action: PayloadAction<PutUserAddressActionType>) {

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
      putUserAddressFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}/addresses/${action.payload.addressId}`

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
          addressId: action.payload.addressId,
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
      yield put(
        userActions.updateAddress({
          address: response.data,
          userId: action.payload.userId,
        })
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        putUserAddressFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
        putUserAddressFetchStatusActions.update(FetchStatusEnum.FAILED)
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






