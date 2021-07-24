import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { getOrderFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { orderActions, orderPaginationPageActions, orderPaginationTotalElementsActions, orderPaginationTotalPagesActions } from "reducers/slices/domain/order";
import { all, call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { generateQueryString } from "src/utils";

/**
 * a worker (generator)    
 *
 *  - fetch all of this domain 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (OrderType)
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
export function* fetchOrderWorker(action: PayloadAction<{}>) {

  /**
   * get cur user type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)


  if (curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for anime data
     **/
    yield put(
      getOrderFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * prep query string
     **/
    const curQueryString = yield select(mSelector.makeOrderQueryStringSelector())

    console.log(curQueryString)
    console.log(generateQueryString(curQueryString));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/orders${generateQueryString(curQueryString)}`

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
      getOrderFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update order domain in state
       *
       **/
      yield put(
        orderActions.update(response.content)
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


      console.log(response.pageable)

      console.log("total pages")
      console.log(response.totalPages)

      yield all([
        put(orderPaginationPageActions.update(response.pageable.pageNumber)),
        put(orderPaginationTotalPagesActions.update(response.totalPages)),
        put(orderPaginationTotalElementsActions.update(response.totalElements)),
      ])

    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      console.log(response.message)

    }
  } else {
    console.log("permission denied. your order type: " + curAuth.userType)
  }
}




