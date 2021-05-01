import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { getProductFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import { productActions } from "reducers/slices/domain/product";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { normalize } from "normalizr";
import { productSchemaArray } from "states/state";
import { NormalizedProductType } from "domain/product/types";

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
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/products`

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
      console.log(response) // pageable response
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





