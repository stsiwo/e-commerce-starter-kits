import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { NormalizedProductType } from "domain/product/types";
import { normalize } from "normalizr";
import { getProductFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import { productActions, productPaginationPageActions, productPaginationTotalPagesActions, productPaginationTotalElementsActions } from "reducers/slices/domain/product";
import { all, call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { generateQueryString } from "src/utils";
import { productSchemaArray } from "states/state";

/**
 * a worker (generator)    
 *
 *  - fetch all of this domain 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *    - for member/guest user, use 'fetchProductWithCacheWorker' instead for caching feature.
 *
 *  - (ProductType)
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
export function* fetchProductWorker(action: PayloadAction<{}>) {

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
      getProductFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * prep query string
     **/
    const curQueryString = yield select(mSelector.makeProductQueryStringSelector())

    console.log(curQueryString)
    console.log(generateQueryString(curQueryString));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/products${generateQueryString(curQueryString)}`

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
       * normalize response data
       *
       *  - TODO: make sure response structure with remote api
       **/
      console.log(response) // pageable response
      const normalizedData = normalize(response.data.content, productSchemaArray)

      /**
       * update product domain in state
       *
       * - use 'update' instead of 'merge' since no cache
       *
       **/
      yield put(
        productActions.update(normalizedData.entities.products as NormalizedProductType)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        getProductFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
        put(productPaginationPageActions.update(response.data.pageable.pageNumber)),
        put(productPaginationTotalPagesActions.update(response.data.totalPages)),
        put(productPaginationTotalElementsActions.update(response.data.totalElements)),
      ])

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        getProductFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  } else {
    console.log("permission denied. your product type: " + curAuth.userType)
  }
}





