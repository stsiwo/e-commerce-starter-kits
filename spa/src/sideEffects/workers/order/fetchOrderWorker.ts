import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { getOrderFetchStatusActions } from "reducers/slices/app/fetchStatus/order";
import { orderActions, orderPaginationPageActions, orderPaginationTotalPagesActions, orderPaginationTotalElementsActions } from "reducers/slices/domain/order";
import { call, put, select, all } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector, mSelector } from "src/selectors/selector";
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
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "GET",
        url: apiUrl,
      })

      /**
       * update order domain in state
       *
       **/
      yield put(
        orderActions.concat(response.data.data)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        getOrderFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
        put(orderPaginationPageActions.update(response.data.pageable.pageNumber)),
        put(orderPaginationTotalPagesActions.update(response.data.totalPages)),
        put(orderPaginationTotalElementsActions.update(response.data.totalElements)),
      ])

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        getOrderFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  } else {
    console.log("permission denied. your order type: " + curAuth.userType)
  }
}




