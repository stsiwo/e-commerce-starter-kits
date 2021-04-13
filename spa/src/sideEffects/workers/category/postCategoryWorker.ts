import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { appConfig } from "configs/appConfig";
import { CategoryType, NormalizedCategoryType } from "domain/product/types";
import { normalize } from "normalizr";
import { postCategoryFetchStatusActions } from "reducers/slices/app/fetchStatus/category";
import { categoryActions } from "reducers/slices/domain/category";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { categorySchemaArray } from "states/state";

/**
 * a worker (generator)    
 *
 *  - post cart items of current user 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): N/A (permission denied) 
 *      - (Member): N/A (permission denied) 
 *      - (Admin): OK 
 *
 *  - steps:
 *
 *      (Admin): 
 *
 *        a1. send post request to api to post a new data 
 *
 *        a2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - payload (e.g., CategoryType) does not have any id yet.
 *  
 **/
export function* postCategoryWorker(action: PayloadAction<CategoryType>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  /**
   *
   * Member User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for anime data
     **/
    yield put(
      postCategoryFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${appConfig.baseUrl}/categories`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(axios, {
        method: "POST",
        url: apiUrl,
        data: action.payload
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
        categoryActions.merge(normalizedData.entities as NormalizedCategoryType)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        postCategoryFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

    } catch (error) {

      console.log(error)
      /**
       * update fetch status failed
       **/
      yield put(
        postCategoryFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  } 
}


