import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { ReviewCriteria } from "domain/review/type";
import { messageActions } from "reducers/slices/app";
import { postReviewFetchStatusActions } from "reducers/slices/app/fetchStatus/review";
import { PostReviewActionType, reviewActions } from "reducers/slices/domain/review";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";

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
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)


  if (curAuth.userType === UserTypeEnum.MEMBER || curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for anime data
     **/
    yield put(
      postReviewFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/reviews`

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
          reviewTitle: action.payload.reviewTitle,
          reviewDescription: action.payload.reviewDescription,
          isVerified: false, // when creating, always false
          note: action.payload.note,
          userId: action.payload.userId,
          productId: action.payload.productId,
          reviewPoint: action.payload.reviewPoint,
        } as ReviewCriteria
      })

      /**
       * update review domain in state
       *
       **/
      yield put(
        reviewActions.append(response.data)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        postReviewFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
        postReviewFetchStatusActions.update(FetchStatusEnum.FAILED)
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





