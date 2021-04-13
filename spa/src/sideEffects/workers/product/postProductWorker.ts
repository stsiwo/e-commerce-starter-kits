import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { appConfig } from "configs/appConfig";
import { ProductType, NormalizedProductType } from "domain/product/types";
import { postProductFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import { productActions } from "reducers/slices/domain/product";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { normalize } from "normalizr";
import { productSchemaArray } from "states/state";

/**
 * a worker (generator)    
 *
 *  - post this domain to create new
 *
 *  - NOT gonna use caching since it might be stale soon and the product can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): N/A 
 *      - (Member): N/A 
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
 *    - this domain does not have its id yet.
 *
 **/
export function* postProductWorker(action: PayloadAction<ProductType>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  /**
   *
   * Admin User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for post product data
     **/
    yield put(
      postProductFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this domain
     **/
    const apiUrl = `${appConfig.baseUrl}/products`

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
      const normalizedData = normalize(response.data.data, productSchemaArray)

      /**
       * update product domain in state
       *
       **/
      yield put(
        productActions.merge(normalizedData.entities as NormalizedProductType)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        postProductFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        postProductFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  } 
}







