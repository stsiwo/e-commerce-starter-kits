import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { getNotificationFetchStatusActions } from "reducers/slices/app/fetchStatus/notification";
import { FetchNotificationActionType, notificationActions, notificationPaginationActions } from "reducers/slices/domain/notification";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { generateQueryString } from "src/utils";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);
/**
 * a worker (generator)    
 *
 *  - fetch all of this domain 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *    - for member/guest user, use 'fetchNotificationWithCacheWorker' instead for caching feature.
 *
 *  - (NotificationType)
 *
 *      - (Guest): N/A  
 *      - (Member): N/A 
 *      - (Admin): send get request and receive all domain and save it to redux store 
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
export function* fetchNotificationWorker(action: PayloadAction<FetchNotificationActionType>) {

  log("start fetchNotificationWorker")
  /**
   * get cur user type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  log("start auth type: " + curAuth.userType)

  if (curAuth.userType === UserTypeEnum.ADMIN || curAuth.userType === UserTypeEnum.MEMBER) {

    /**
     * update status for anime data
     **/
    yield put(
      getNotificationFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * prep query string
     **/
    const curQueryString = yield select(mSelector.makeNotificationQueryStringSelector())

    log(curQueryString)
    log(generateQueryString(curQueryString));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/notifications${generateQueryString(curQueryString)}`

    log("target url: " + apiUrl)

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() => api({
      method: "GET",
      url: apiUrl,
    })
      .then(response => ({ 
        fetchStatus: FetchStatusEnum.SUCCESS, 
        content: response.data.content, 
        pageable: response.data.pageable, 
        totalPages: response.data.totalPages, 
        totalElements: response.data.totalElements,
        last: response.data.last,
      }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )

    /**
     * update fetch status sucess
     **/
    yield put(
      getNotificationFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      log(response) // pageable response
      /**
       * update notification domain in state
       *
       * - initial fetch use 'update' (e.g., replace)
       * - 'read more' use 'concat' (keep the prevous and concat)
       *
       **/
      // replace
      if (action.payload.type === "update") {
        yield put(
          notificationActions.update(response.content)
        )
      } else {
        // concat
        yield put(
          notificationActions.concat(response.content)
        )
      }

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
       *  <last>true</last> <- USE THIS TO CHECK IF HAS NEXT PAGE OR NOT
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

      log("is last")
      log(response.last)

      log("size")
      log(response.pageable.pageSize)

      yield put(
        notificationPaginationActions.update({
          limit: response.pageable.pageSize,
          page: response.pageable.pageNumber,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          last: response.last,
        })
      )
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.fetchStatus)
    }
  } else {
    log("permission denied. your notification type: " + curAuth.userType)
  }
}





