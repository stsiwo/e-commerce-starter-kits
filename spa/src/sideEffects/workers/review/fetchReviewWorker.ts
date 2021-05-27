import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { getReviewFetchStatusActions } from "reducers/slices/app/fetchStatus/review";
import { reviewActions, reviewPaginationPageActions, reviewPaginationTotalPagesActions, reviewPaginationTotalElementsActions } from "reducers/slices/domain/review";
import { call, put, select, all } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector, mSelector } from "src/selectors/selector";
import { generateQueryString } from "src/utils";

/**
 * a worker (generator)    
 *
 *  - fetch review items of current review 
 *
 *  - NOT gonna use caching since it might be stale soon and the review can update any time.
 *
 *  - (ReviewType)
 *
 *      - (Guest): N/A (permission denied) 
 *      - (Member): N/A (permission denied) 
 *      - (Admin): send fetch request and receive data and save it  to redux store
 *
 *  - steps:
 *
 *      (Admin): 
 *
 *        a1. send fetch request to api to grab data
 *
 *        a2. receive the response and save it to redux store
 *  
 **/
export function* fetchReviewWorker(action: PayloadAction<{}>) {

  /**
   * get cur review type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)


  if (curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for anime data
     **/
    yield put(
      getReviewFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )
    /**
     * prep query string
     **/
    const curQueryString = yield select(mSelector.makeReviewQueryStringSelector())

    console.log(curQueryString)
    console.log(generateQueryString(curQueryString));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/reviews${generateQueryString(curQueryString)}`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "GET",
        url: apiUrl,
      })

      /**
       * update review domain in state
       *
       **/
      yield put(
        reviewActions.update(response.data.content)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        getReviewFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

      /**
       * update pagination.
       *
       * sample response data:
       * 
       * <PageImpl>
       *  <content>
       *    ... actual content
       *  </content>
       *  <pageable>
       *   <sort>
       *   <sorted>true</sorted>
       *   <unsorted>false</unsorted>
       *   <empty>false</empty>
       *   </sort>
       *   <pageNumber>1</pageNumber>
       *   <pageSize>20</pageSize>
       *   <offset>20</offset>
       *   <paged>true</paged>
       *   <unpaged>false</unpaged>
       *  </pageable>
       *  <totalPages>2</totalPages>
       *  <totalElements>25</totalElements>
       *  <last>true</last>
       *  <sort>
       *   <sorted>true</sorted>
       *   <unsorted>false</unsorted>
       *   <empty>false</empty>
       *  </sort>
       *  <first>false</first>
       *  <number>1</number>
       *  <numberOfElements>5</numberOfElements>
       *  <size>20</size>
       *  <empty>false</empty>
       * </PageImpl>
       **/


      console.log(response.data.pageable)

      console.log("total pages")
      console.log(response.data.totalPages)

      yield all([
        put(reviewPaginationPageActions.update(response.data.pageable.pageNumber)),
        put(reviewPaginationTotalPagesActions.update(response.data.totalPages)),
        put(reviewPaginationTotalElementsActions.update(response.data.totalElements)),
      ])

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        getReviewFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  } else {
    console.log("permission denied. your review type: " + curAuth.userType)
  }
}




