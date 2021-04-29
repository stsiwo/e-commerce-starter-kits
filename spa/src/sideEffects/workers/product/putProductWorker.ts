import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { ProductType, NormalizedProductType } from "domain/product/types";
import { putProductFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import { productActions } from "reducers/slices/domain/product";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { normalize } from "normalizr";
import { productSchemaArray } from "states/state";

/**
 * a worker (generator)    
 *
 *  - put this domain to replace
 *
 *  - NOT gonna use caching since it might be stale soon and the product can update any time.
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
 *        a1. send put request to api to put a new data 
 *
 *        a2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - keep the same id since it is replacement 
 *
 **/
export function* putProductWorker(action: PayloadAction<ProductType>) {

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
     * update status for put product data
     **/
    yield put(
      putProductFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this  domain
     **/
    const apiUrl = `${API1_URL}/products/${action.payload.productId}`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(axios, {
        method: "PUT",
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
        putProductFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        putProductFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  } 
}






