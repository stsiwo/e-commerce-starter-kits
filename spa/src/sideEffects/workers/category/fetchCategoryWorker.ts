import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import {
  CategoryQueryStringType,
  NormalizedCategoryType,
} from "domain/product/types";
import { normalize } from "normalizr";
import { getCategoryFetchStatusActions } from "reducers/slices/app/fetchStatus/category";
import {
  categoryActions,
  categoryPaginationPageActions,
  categoryPaginationTotalElementsActions,
  categoryPaginationTotalPagesActions,
} from "reducers/slices/domain/category";
import { all, call, put, select } from "redux-saga/effects";
import { FetchStatusEnum } from "src/app";
import { mSelector } from "src/selectors/selector";
import { generateQueryString } from "src/utils";
import { categorySchemaArray } from "states/state";

const log = logger(__filename);

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
  yield put(getCategoryFetchStatusActions.update(FetchStatusEnum.FETCHING));

  /**
   * prep query string
   **/
  const curQueryString: CategoryQueryStringType = yield select(
    mSelector.makeCategoryQueryStringSelector()
  );

  log(curQueryString);
  log(generateQueryString(curQueryString));

  /**
   * grab all domain
   **/
  const apiUrl = `${API1_URL}/categories${generateQueryString(curQueryString)}`;

  /**
   * fetch data
   **/

  // prep keyword if necessary

  // start fetching
  const response: WorkerResponse = yield call(() =>
    api({
      method: "GET",
      url: apiUrl,
    })
      .then((response) => ({
        fetchStatus: FetchStatusEnum.SUCCESS,
        content: response.data.content,
        pageable: response.data.pageable,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
      }))
      .catch((e) => ({
        fetchStatus: FetchStatusEnum.FAILED,
        message: e.response.data.message,
      }))
  );

  /**
   * update fetch status sucess
   **/
  yield put(getCategoryFetchStatusActions.update(response.fetchStatus));

  if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
    /**
     * normalize response data
     *
     *  - TODO: make sure response structure with remote api
     **/
    log(response); // pageable response
    const normalizedData = normalize(response.content, categorySchemaArray);

    /**
     * update categories domain in state
     *
     **/
    yield put(
      categoryActions.update(
        normalizedData.entities.categories as NormalizedCategoryType
      )
    );

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

    log(response.pageable);

    log("total pages");
    log(response.totalPages);

    yield all([
      put(categoryPaginationPageActions.update(response.pageable.pageNumber)),
      put(categoryPaginationTotalPagesActions.update(response.totalPages)),
      put(
        categoryPaginationTotalElementsActions.update(response.totalElements)
      ),
    ]);
  } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
    log(response.message);
  }
}
