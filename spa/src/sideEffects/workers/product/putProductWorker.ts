import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { NormalizedProductType } from "domain/product/types";
import { normalize } from "normalizr";
import { messageActions } from "reducers/slices/app";
import { putProductFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import { productActions, PutProductActionType } from "reducers/slices/domain/product";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { generateObjectFormData, getNanoId } from "src/utils";
import { productSchemaArray, productSchemaEntity } from "states/state";
import { productFormDataGenerator } from "domain/product/formData";

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
export function* putProductWorker(action: PayloadAction<PutProductActionType>) {

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

      // prep form data
      const formData = productFormDataGenerator(action.payload)

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "PUT",
        url: apiUrl,
        data: formData, 
        headers: { "Content-Type": "multipart/form-data" },
      })

      /**
       * normalize response data
       *
       *  - TODO: make sure response structure with remote api
       **/
      const normalizedData = normalize(response.data, productSchemaEntity)

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
        putProductFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "updated successfully.",
        }) 
      )
    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        putProductFetchStatusActions.update(FetchStatusEnum.FAILED)
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






