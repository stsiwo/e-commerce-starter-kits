import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { productFormDataGenerator } from "domain/product/formData";
import { NormalizedProductType } from "domain/product/types";
import { normalize } from "normalizr";
import { messageActions } from "reducers/slices/app";
import { postProductFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import { PostProductActionType, productActions } from "reducers/slices/domain/product";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { productSchemaEntity } from "states/state";

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
export function* postProductWorker(action: PayloadAction<PostProductActionType>) {

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
    const apiUrl = `${API1_URL}/products`

    /**
     * fetch data
     **/
    try {

      // prep form data
      const formData = productFormDataGenerator(action.payload)


      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "POST",
        url: apiUrl,
        data: formData, 
        headers: { "Content-Type": "multipart/form-data" },
      })

      console.log("posted product")
      console.log(response.data)
      /**
       * normalize response data
       *
       *  - TODO: make sure response structure with remote api
       **/
      const normalizedData = normalize(response.data, productSchemaEntity)

      console.log("normalized product")
      console.log(normalizedData)

      /**
       * update product domain in state
       *
       **/
      yield put(
        // be careful when normalized a single object, you need to append its domain name (plural) to 'entities'
        productActions.merge(normalizedData.entities.products as NormalizedProductType)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        postProductFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "added successfully.",
        }) 
      )
    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        postProductFetchStatusActions.update(FetchStatusEnum.FAILED)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: error.message, 
        }) 
      )
    }
  } 
}







