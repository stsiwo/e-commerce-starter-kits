import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { createCartItem } from "domain/cart";
import { WishlistItemType } from "domain/wishlist/types";
import { messageActions } from "reducers/slices/app";
import { patchWishlistItemFetchStatusActions } from "reducers/slices/app/fetchStatus/wishlistItem";
import { cartItemActions } from "reducers/slices/domain/cartItem";
import {
  PatchWishlistItemActionType,
  wishlistItemActions,
} from "reducers/slices/domain/wishlistItem";
import { call, put, select } from "redux-saga/effects";
import {
  AuthType,
  FetchStatusEnum,
  MessageTypeEnum,
  UserTypeEnum,
} from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - patch (move to cart) wishlist items of current user
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): add a new data to redux saga
 *      - (Member): send api request to patch a new data and assign response data to the redux saga
 *      - (Admin): N/A
 *
 *  - steps:
 *
 *      (Guest):
 *
 *        g1. save the new data to redux store
 *
 *      (Member):
 *
 *        m1. send patch request to api to patch a new data
 *
 *        m2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - payload (e.g., WishlistItemType) does not have any id yet.
 *
 *      (Guest):
 *
 *        - need to assign the id temporarly (e.g., int, uuidv4). the id is not kept when the user create an account (e.g., member)
 *
 *      (Member):
 *
 *        - don't need to assign the id. the back-end takes care of that.
 *
 **/
export function* patchWishlistItemWorker(
  action: PayloadAction<PatchWishlistItemActionType>
) {
  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

  /**
   *
   * Member User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.MEMBER) {
    /**
     * update status for anime data
     **/
    yield put(
      patchWishlistItemFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/wishlistItems/${action.payload.wishlistItemId}`;

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response: WorkerResponse = yield call(() =>
      api({
        method: "PATCH",
        headers: { "If-Match": `"${action.payload.version}"` },
        url: apiUrl,
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
    yield put(patchWishlistItemFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update categories domain in state
       *
       *  - receive the newly added data as response data
       *
       **/
      yield put(wishlistItemActions.delete(action.payload.wishlistItemId));

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "moved to cart successfully.",
        })
      );
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);

      /**
       * update fetch status failed
       **/
      yield put(
        patchWishlistItemFetchStatusActions.update(FetchStatusEnum.FAILED)
      );
    }
  } else if (curAuth.userType === UserTypeEnum.GUEST) {
    /**
     * Guest User Type
     *
     **/
    /**
     * delete wishlist item and create new one
     *
     *
     **/
    yield put(wishlistItemActions.delete(action.payload.wishlistItemId));

    /**
     *  get target wishlistItem
     **/
    const targetWishlistItem: WishlistItemType = yield select(
      mSelector.makeSingleWishlistItemSelector(action.payload.wishlistItemId)
    );

    /**
     * move to cart
     **/
    yield put(
      cartItemActions.append(
        createCartItem(
          action.payload.wishlistItemId,
          targetWishlistItem.product
        )
      )
    );

    /**
     * update message
     **/
    yield put(
      messageActions.update({
        id: getNanoId(),
        type: MessageTypeEnum.SUCCESS,
        message: "moved to cart successfully.",
      })
    );
  }
}
