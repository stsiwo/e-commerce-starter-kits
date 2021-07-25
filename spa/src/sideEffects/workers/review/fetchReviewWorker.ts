import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { getReviewFetchStatusActions } from "reducers/slices/app/fetchStatus/review";
import { reviewActions, reviewPaginationPageActions, reviewPaginationTotalElementsActions, reviewPaginationTotalPagesActions } from "reducers/slices/domain/review";
import { all, call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { generateQueryString } from "src/utils";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);

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

    log(curQueryString)
    log(generateQueryString(curQueryString));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/reviews${generateQueryString(curQueryString)}`

    /**
     * fetch data
     **/

      // prep keyword if necessary

      // start fetching
    const response = yield call(() => api({
        method: "GET",
        url: apiUrl,
      })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, content: response.data.content, pageable: response.data.pageable, totalPages: response.data.totalPages, totalElements: response.data.totalElements }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )
      /**
       * update fetch status sucess
       **/
      yield put(
        getReviewFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update review domain in state
       *
       **/
      yield put(
        reviewActions.update(response.content)
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


      log(response.pageable)

      log("total pages")
      log(response.totalPages)

      yield all([
        put(reviewPaginationPageActions.update(response.pageable.pageNumber)),
        put(reviewPaginationTotalPagesActions.update(response.totalPages)),
        put(reviewPaginationTotalElementsActions.update(response.totalElements)),
      ])

    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      log(response.message)

    }
  } else {
    log("permission denied. your review type: " + curAuth.userType)
  }
}




