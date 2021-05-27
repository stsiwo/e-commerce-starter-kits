import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { ReviewCriteria } from "domain/review/type";
import { messageActions } from "reducers/slices/app";
import { postReviewFetchStatusActions, putReviewFetchStatusActions } from "reducers/slices/app/fetchStatus/review";
import { PostReviewActionType, reviewActions, PutReviewActionType } from "reducers/slices/domain/review";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";

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
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "PUT",
        url: apiUrl,
        data: {
          reviewId: action.payload.reviewId,
          reviewTitle: action.payload.reviewTitle,
          reviewDescription: action.payload.reviewDescription,
          isVerified: action.payload.isVerified, // when member, this should be false. and when admin, this should be true 
          note: action.payload.note, // this should be only displayed on admin page
          reviewPoint: action.payload.reviewPoint,
        } as ReviewCriteria
      })

      /**
       * update review domain in state
       *
       **/
      yield put(
        reviewActions.updateOne(response.data)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        putReviewFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
        putReviewFetchStatusActions.update(FetchStatusEnum.FAILED)
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
    console.log("permission denied. your review type: " + curAuth.userType)
  }
}






