import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { UserAddressCriteria } from "domain/user/types";
import { messageActions } from "reducers/slices/app";
import { putUserAddressFetchStatusActions } from "reducers/slices/app/fetchStatus/user";
import {
  PutUserAddressActionType,
  userActions,
} from "reducers/slices/domain/user";
import { call, put, select } from "redux-saga/effects";
import {
  AuthType,
  FetchStatusEnum,
  MessageTypeEnum,
  UserTypeEnum,
} from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { logger } from "configs/logger";
const log = logger(__filename);

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
export function* putUserAddressWorker(
  action: PayloadAction<PutUserAddressActionType>
) {
  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

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
    );

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${action.payload.userId}/addresses/${action.payload.addressId}`;

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() =>
      api({
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
        } as UserAddressCriteria,
      })
        .then((response) => ({
          fetchStatus: FetchStatusEnum.SUCCESS,
          data: response.data,
        }))
        .catch((e) => ({
          fetchStatus: FetchStatusEnum.FAILED,
          message: e.response.data.message,
        }))
    );

    /**
     * update fetch status sucess
     **/
    yield put(putUserAddressFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update this domain in state
       *
       **/
      yield put(
        userActions.updateAddress({
          address: response.data,
          userId: action.payload.userId,
        })
      );

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "updated successfully.",
        })
      );
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);

      /**
       * update fetch status failed
       **/
      yield put(
        putUserAddressFetchStatusActions.update(FetchStatusEnum.FAILED)
      );

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: response.message,
        })
      );
    }
  } else {
    log("permission denied: you are " + curAuth.userType);
  }
}
