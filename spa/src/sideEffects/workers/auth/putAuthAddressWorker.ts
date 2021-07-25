import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { UserAddressCriteria } from "domain/user/types";
import { authActions, messageActions, PutAuthAddressActionType } from "reducers/slices/app";
import { putAuthAddressFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);

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
export function* putAuthAddressWorker(action: PayloadAction<PutAuthAddressActionType>) {

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
      putAuthAddressFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/addresses/${action.payload.addressId}`

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() => api({
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
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, data: response.data }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )

    /**
     * update fetch status sucess
     **/
    yield put(
      putAuthAddressFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {

      /**
       * update this domain in state
       *
       **/
      yield put(
        authActions.updateAddress(response.data)
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

    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      log(response.message)

      /**
       * update fetch status failed
       **/
      yield put(
        putAuthAddressFetchStatusActions.update(FetchStatusEnum.FAILED)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: response.message,
        })
      )
    }
  } else if (curAuth.userType === UserTypeEnum.GUEST) {

    yield put(
      authActions.updateAddress(action.payload)
    )
  }
}






