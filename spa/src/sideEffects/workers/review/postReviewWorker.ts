import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { ReviewCriteria } from "domain/review/type";
import { messageActions } from "reducers/slices/app";
import { postReviewFetchStatusActions } from "reducers/slices/app/fetchStatus/review";
import {
  PostReviewActionType,
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

const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - post review items of current review
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
export function* postReviewWorker(action: PayloadAction<PostReviewActionType>) {
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
    yield put(postReviewFetchStatusActions.update(FetchStatusEnum.FETCHING));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/reviews`;

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
          reviewTitle: action.payload.reviewTitle,
          reviewDescription: action.payload.reviewDescription,
          isVerified: false, // when creating, always false
          note: action.payload.note,
          userId: action.payload.userId,
          productId: action.payload.productId,
          reviewPoint: action.payload.reviewPoint,
          version: action.payload.version,
        } as ReviewCriteria,
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
    yield put(postReviewFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update review domain in state
       *
       **/
      yield put(reviewActions.append(response.data));

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
      yield put(postReviewFetchStatusActions.update(FetchStatusEnum.FAILED));
    }
  } else {
    log("permission denied. your review type: " + curAuth.userType);
  }
}
