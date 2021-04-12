import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { appConfig } from "configs/appConfig";
import { NormalizedCategoryType } from "domain/product/types";
import { normalize } from "normalizr";
import { categoryFetchStatusActions } from "reducers/slices/app";
import { categoryActions } from "reducers/slices/domain/category";
import { call, put } from "redux-saga/effects";
import { FetchStatusEnum, RequestTrackerBaseType } from "src/app";
import { categorySchemaArray } from "states/state";
import { requestUrlCheckWorker } from "./common/requestUrlCheckWorker";

/**
 * a worker (generator)    
 *
 *  - only run this once to get all categories and store it in the store.
 *  
 **/
export function* fetchCategoryWorker(action: PayloadAction<{}>) {


  /**
   * update status for anime data
   **/
  yield put(
    categoryFetchStatusActions.update(FetchStatusEnum.FETCHING)
  )

  /**
   * grab all categories
   *  - might be better way to do this category filtering #PERFORMANCE
   **/
  const apiUrl = `${appConfig.baseUrl}/categories`

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
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(axios, {
        method: "get",
        url: apiUrl,
      })

      /**
       * normalize response data
       *
       *  - TODO: make sure response structure with remote api
       **/
      const normalizedData = normalize(response.data.data, categorySchemaArray)

      /**
       * update categories domain in state
       *
       **/
      yield put(
        categoryActions.update(normalizedData.entities as NormalizedCategoryType)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        categoryFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        categoryFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }

  }
}
