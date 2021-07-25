import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { NormalizedProductType } from "domain/product/types";
import { normalize } from "normalizr";
import { getPublicProductFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import { productActions, productPaginationPageActions, productPaginationTotalElementsActions, productPaginationTotalPagesActions } from "reducers/slices/domain/product";
import { all, call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { generateQueryString } from "src/utils";
import { productSchemaArray } from "states/state";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);

/**
 * a worker (generator)    
 *
 *  - fetch all of this domain (public only)
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *    - for member/guest user, use 'fetchProductWithCacheWorker' instead for caching feature.
 *
 *  - (ProductType)
 *
 *      - (Guest): OK  
 *      - (Member): OK 
 *      - (Admin): N/A 
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
export function* fetchPublicProductWorker(action: PayloadAction<{}>) {

  /**
   * get cur user type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)


  if (curAuth.userType === UserTypeEnum.GUEST || curAuth.userType === UserTypeEnum.MEMBER || curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for anime data
     **/
    yield put(
      getPublicProductFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * prep query string
     **/
    const curQueryString = yield select(mSelector.makeProductQueryStringSelector())

    log(curQueryString)
    log(generateQueryString(curQueryString));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/products/public${generateQueryString(curQueryString)}`

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
      getPublicProductFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * normalize response data
       *
       *  - TODO: make sure response structure with remote api
       **/
      log(response) // pageable response
      const normalizedData = normalize(response.content, productSchemaArray)

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
        put(productPaginationPageActions.update(response.pageable.pageNumber)),
        put(productPaginationTotalPagesActions.update(response.totalPages)),
        put(productPaginationTotalElementsActions.update(response.totalElements)),
      ])

    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      log(response.message)

    }
  } else {
    log("permission denied. your product type: " + curAuth.userType)
  }
}





