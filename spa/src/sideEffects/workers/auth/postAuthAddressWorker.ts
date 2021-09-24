import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { UserAddressCriteria } from "domain/user/types";
import {
  authActions,
  messageActions,
  PostAuthAddressActionType,
} from "reducers/slices/app";
import { postAuthAddressFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
import { call, put, select } from "redux-saga/effects";
import {
  AuthType,
  FetchStatusEnum,
  MessageTypeEnum,
  UserTypeEnum,
} from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";

const log = logger(__filename);

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
export function* postAuthAddressWorker(
  action: PayloadAction<PostAuthAddressActionType>
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
  if (
    curAuth.userType === UserTypeEnum.ADMIN ||
    curAuth.userType === UserTypeEnum.MEMBER
  ) {
    /**
     * update status for put user data
     **/
    yield put(
      postAuthAddressFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/addresses`;

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response: WorkerResponse = yield call(() =>
      api({
        method: "POST",
        url: apiUrl,
        headers: { "If-Match": `"${action.payload.version}"` },
        data: {
          // don't put addressId
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
    yield put(postAuthAddressFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update this domain in state
       *
       **/
      log("added address from response");
      log(response.data);
      yield put(authActions.appendAddress(response.data));

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "added successfully.",
        })
      );
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);

      /**
       * update fetch status failed
       **/
      yield put(
        postAuthAddressFetchStatusActions.update(FetchStatusEnum.FAILED)
      );
    }
  } else if (curAuth.userType === UserTypeEnum.GUEST) {
    yield put(authActions.appendAddress(action.payload));
  }
}
