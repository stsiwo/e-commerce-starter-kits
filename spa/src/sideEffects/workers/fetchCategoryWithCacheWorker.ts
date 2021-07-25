import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { NormalizedCategoryType } from "domain/product/types";
import { normalize } from "normalizr";
import { requestTrackerActions } from "reducers/slices/app";
import { getCategoryFetchStatusActions } from "reducers/slices/app/fetchStatus/category";
import { categoryActions } from "reducers/slices/domain/category";
import { call, put } from "redux-saga/effects";
import { FetchStatusEnum, RequestTrackerBaseType } from "src/app";
import { categorySchemaArray } from "states/state";
import { requestUrlCheckWorker } from "./common/requestUrlCheckWorker";
import { logger } from 'configs/logger';
const log = logger(import.meta.url);
/**
 * a worker (generator)    
 *
 *  - only run this once to get all categories and store it in the store.
 *
 *  - should be used by only member/guest. don't use this with admin user since it is easily get stale.
 *
 *  
 **/
export function* fetchCategoryWithCacheWorker(action: PayloadAction<{}>) {


  /**
   * update status for anime data
   **/
  yield put(
    getCategoryFetchStatusActions.update(FetchStatusEnum.FETCHING)
  )

  /**
   * grab all categories
   *  - might be better way to do this category filtering #PERFORMANCE
   **/
  const apiUrl = `${API1_URL}/categories`

  // return empty object if does not exist
  const targetRequestTrackerBase: RequestTrackerBaseType = yield call(requestUrlCheckWorker, apiUrl)

  if (targetRequestTrackerBase) {
    // target url exists

    // currently do nothing
  } else {
    // target url does not exist

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response = yield call(() => api({
      method: "get",
      url: apiUrl,
    })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, content: response.data.content, pageable: response.data.pageable, totalPages: response.data.totalPages, totalElements: response.data.totalElements }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )

    /**
     * update fetch status sucess
     **/
    yield put(
      getCategoryFetchStatusActions.update(FetchStatusEnum.SUCCESS)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * normalize response data
       *
       *  - TODO: make sure response structure with remote api
       **/
      const normalizedData = normalize(response.content, categorySchemaArray)

      /**
       * update categories domain in state
       *
       **/
      yield put(
        categoryActions.update(normalizedData.entities.categories as NormalizedCategoryType)
      )

      /**
       * add the url to requestUrlTracker state
       **/
      yield put(
        requestTrackerActions.update({
          [apiUrl]: {
            ids: normalizedData.result,
            //pagination: ...
          }
        })
      )

    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      log(response.message)

    }

  }
}
