import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from "axios";
import { api } from "configs/axiosConfig";
import { stripeClientSecretFetchStatusActions } from "reducers/slices/app/fetchStatus/stripeClientSecret";
import { stripeClientSecretActions } from "reducers/slices/app/private/stripeClientSecret";
import { call, put } from "redux-saga/effects";
import { FetchStatusEnum } from "src/app";

/**
 * a worker (generator)    
 *
 *  - request stripe client secret for the payment
 *
 *  stpes: 
 *
 *    1. send request to /create-payment-intent and receive client_secret
 *
 *    2. save it to redux store.
 *
 *  note:
 *
 *    - security concern:
 *
 *      - some people said that storing sensitive info in redux store is dangerous. but as long as I don't persist it in local storage/session storage, its vulnerability is same as pure js.
 *
 *        - so i use redux store to share the data with different component, but NEVER EVER persist this client_secret to any storage in browser!!!!
 *  
 **/
export function* requestStripeClientSecretWorker(action: PayloadAction<{}>) {



  /**
   * update status for put order data
   **/
  yield put(
    stripeClientSecretFetchStatusActions.update(FetchStatusEnum.FETCHING)
  )

  /**
   * grab this  domain
   **/
  const apiUrl = `${API1_URL}/create-payment-intent`

  /**
   * fetch data
   **/
  try {

    // prep keyword if necessary

    // start fetching
    const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
      method: "POST",
      url: apiUrl,
      data: action.payload
    })

    console.log(response.data)

    /**
     * update this domain in state
     *
     *  response.data = an object returned from api
     *
     *    - e.g., Object { clientSecret: "pi_1IgLtGGsn7HlXlcZ3GZxa2II_secret_aTp0z92Ltv2r5CtgRz9odg5pL" }
     *
     *  - this is sensitive data, so NEVER EVER persist this data.
     *
     **/
    yield put(
      stripeClientSecretActions.update(response.data.clientSecret)
    )

    /**
     * update fetch status sucess
     **/
    yield put(
      stripeClientSecretFetchStatusActions.update(FetchStatusEnum.SUCCESS)
    )

  } catch (error) {

    console.log(error)

    /**
     * update fetch status failed
     **/
    yield put(
      stripeClientSecretFetchStatusActions.update(FetchStatusEnum.FAILED)
    )
  }
}

