import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { NormalizedCategoryType } from "domain/product/types";
import { normalize } from "normalizr";
import { getCategoryFetchStatusActions } from "reducers/slices/app/fetchStatus/category";
import { categoryActions, categoryPaginationPageActions, categoryPaginationTotalPagesActions, categoryPaginationTotalElementsActions } from "reducers/slices/domain/category";
import { all, call, put, select } from "redux-saga/effects";
import { FetchStatusEnum } from "src/app";
import { mSelector } from "src/selectors/selector";
import { generateQueryString } from "src/utils";
import { categorySchemaArray } from "states/state";

/**
 * a worker (generator)    
 *
 *  - fetch category items of current user 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *    - for  guest/member user, use 'fetchCategoryWorkerWithCache' to cache data instead.
 *
 *  - (UserType)
 *
 *      - (Guest): use 'fetchCategoryWorkerWithCache' to cache data instead. 
 *      - (Member): use 'fetchCategoryWorkerWithCache' to cache data instead.
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
export function* fetchCategoryWorker(action: PayloadAction<{}>) {

  /**
   * get cur user type
   *
   *  - disabled this. i don't think i need this.
   **/
  //const curAuth: AuthType = yield select(rsSelector.app.getAuth)


  //if (curAuth.userType === UserTypeEnum.MEMBER) {

  /**
   * update status for anime data
   **/
  yield put(
    getCategoryFetchStatusActions.update(FetchStatusEnum.FETCHING)
  )

  /**
   * prep query string
   **/
  const curQueryString = yield select(mSelector.makeCategoryQueryStringSelector())

  console.log(curQueryString)
  console.log(generateQueryString(curQueryString));

  /**
   * grab all domain
   **/
  const apiUrl = `${API1_URL}/categories${generateQueryString(curQueryString)}`

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
    const normalizedData = normalize(response.data.content, categorySchemaArray)

    /**
     * update categories domain in state
     *
     **/
    yield put(
      categoryActions.update(normalizedData.entities.categories as NormalizedCategoryType)
    )

    /**
     * update fetch status sucess
     **/
    yield put(
      getCategoryFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
      put(categoryPaginationPageActions.update(response.data.pageable.pageNumber)),
      put(categoryPaginationTotalPagesActions.update(response.data.totalPages)),
      put(categoryPaginationTotalElementsActions.update(response.data.totalElements)),
    ])

  } catch (error) {

    console.log(error)

    /**
     * update fetch status failed
     **/
    yield put(
      getCategoryFetchStatusActions.update(FetchStatusEnum.FAILED)
    )
  }
  // }
}


