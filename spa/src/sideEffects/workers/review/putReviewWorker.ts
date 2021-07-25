import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { ReviewCriteria } from "domain/review/type";
import { messageActions } from "reducers/slices/app";
import { putReviewFetchStatusActions } from "reducers/slices/app/fetchStatus/review";
import { PutReviewActionType, reviewActions } from "reducers/slices/domain/review";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);

/**
 * a worker (generator)    
 *
 *  - put review items of current review 
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
export function* putReviewWorker(action: PayloadAction<PutReviewActionType>) {

  /**
   * get cur review type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)


  if (curAuth.userType === UserTypeEnum.MEMBER || curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for anime data
     **/
    yield put(
      putReviewFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/reviews/${action.payload.reviewId}`

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() => api({
      method: "PUT",
      url: apiUrl,
      data: {
        reviewId: action.payload.reviewId,
        reviewTitle: action.payload.reviewTitle,
        reviewDescription: action.payload.reviewDescription,
        isVerified: action.payload.isVerified, // when member, this should be false. and when admin, this should be true 
        note: action.payload.note, // this should be only displayed on admin page
        reviewPoint: action.payload.reviewPoint,
        productId: action.payload.productId,
        userId: action.payload.userId,
      } as ReviewCriteria
    })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, data: response.data }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )

    /**
     * update fetch status sucess
     **/
    yield put(
      putReviewFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update review domain in state
       *
       **/
      yield put(
        reviewActions.updateOne(response.data)
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
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      log(response.message)

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
    log("permission denied. your review type: " + curAuth.userType)
  }
}






