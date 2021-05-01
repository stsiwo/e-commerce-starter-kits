import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { getProductFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import { productActions } from "reducers/slices/domain/product";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum, RequestTrackerBaseType } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { normalize } from "normalizr";
import { productSchemaArray } from "states/state";
import { NormalizedProductType } from "domain/product/types";
import { requestUrlCheckWorker } from "./common/requestUrlCheckWorker";
import { requestTrackerActions } from "reducers/slices/app";

/**
 * a worker (generator)    
 *
 *  - fetch all of this domain with cache
 *
 *    - for member/guest user, use 'fetchProductWithCacheWorker' instead for caching feature.
 *
 *  - (ProductType)
 *
 *      - (Guest): send get request and receive all domain and save it to redux store with cache
 *      - (Member): send get request and receive all domain and save it to redux store with cache
 *      - (Admin): N/A 
 *
 *  - steps:
 *
 *      (Guest/Member): 
 *
 *        a1. check the url is requested before or not
 *
 *        a2. if yes, get data from redux store. 
 *
 *        a3. if no, send a request and store it in redux store and also update 'requestUrlTracker' 
 *  
 **/
export function* fetchProductWithCacheWorker(action: PayloadAction<{}>) {

  /**
   * get cur user type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)


  if (curAuth.userType === UserTypeEnum.GUEST || curAuth.userType === UserTypeEnum.MEMBER) {

    /**
     * update status for anime data
     **/
    yield put(
      getProductFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/products`

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
          method: "GET",
          url: apiUrl,
        })

        /**
         * normalize response data
         *
         *  - TODO: make sure response structure with remote api
         **/
        console.log(response)
        const normalizedData = normalize(response.data.content, productSchemaArray)

        /**
         * update product domain in state
         *
         **/
        yield put(
          productActions.merge(normalizedData.entities.products as NormalizedProductType)
        )

        /**
         * update fetch status sucess
         **/
        yield put(
          getProductFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
      } catch (error) {

        console.log(error)

        /**
         * update fetch status failed
         **/
        yield put(
          getProductFetchStatusActions.update(FetchStatusEnum.FAILED)
        )
      }
    }
  } else {
    console.log("permission denied. your product type: " + curAuth.userType)
  }
}





