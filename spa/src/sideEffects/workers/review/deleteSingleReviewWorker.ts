import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { messageActions } from "reducers/slices/app";
import { deleteSingleReviewFetchStatusActions } from "reducers/slices/app/fetchStatus/review";
import {
  DeleteSingleReviewActionType,
  reviewActions,
} from "reducers/slices/domain/review";
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
 *  - deleteSingle review items of current review
 *
 *  - NOT gonna use caching since it might be stale soon and the review can update any time.
 *
 *  - (ReviewType)
 *
 *      - (Guest): N/A (permission denied)
 *      - (Member): OK
 *      - (Admin): OK
 *
 *  - steps:
 *
 *      (Admin):
 *
 *        a1. send fetch request to api to grab data
 *
 *        a2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - currently, only member can create a review.
 *
 **/
export function* deleteSingleReviewWorker(
  action: PayloadAction<DeleteSingleReviewActionType>
) {
  /**
   * get cur review type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

  if (
    curAuth.userType === UserTypeEnum.MEMBER ||
    curAuth.userType === UserTypeEnum.ADMIN
  ) {
    /**
     * update status for anime data
     **/
    yield put(
      deleteSingleReviewFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/reviews/${action.payload.reviewId}`;

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() =>
      api({
        method: "DELETE",
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
    yield put(
      deleteSingleReviewFetchStatusActions.update(response.fetchStatus)
    );

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update review domain in state
       *
       **/
      yield put(
        reviewActions.delete({
          reviewId: action.payload.reviewId,
        })
      );

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "deleted successfully.",
        })
      );
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);

      /**
       * update fetch status failed
       **/
      yield put(
        deleteSingleReviewFetchStatusActions.update(FetchStatusEnum.FAILED)
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
    log("permission denied. your review type: " + curAuth.userType);
  }
}
