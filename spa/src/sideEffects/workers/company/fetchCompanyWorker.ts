import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { getCompanyFetchStatusActions } from "reducers/slices/app/fetchStatus/company";
import { companyActions, FetchCompanyActionType } from "reducers/slices/domain/company";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";

/**
 * a worker (generator)    
 *
 *  - fetch all of this domain 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *    - for member/guest user, use 'fetchCompanyWithCacheWorker' instead for caching feature.
 *
 *  - (CompanyType)
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
export function* fetchCompanyWorker(action: PayloadAction<FetchCompanyActionType>) {

  console.log("start fetchCompanyWorker")
  /**
   * get cur user type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  /**
   * update status for anime data
   **/
  yield put(
    getCompanyFetchStatusActions.update(FetchStatusEnum.FETCHING)
  )

  /**
   * grab all domain
   **/
  const apiUrl = `${API1_URL}/companies/public`

  console.log("target url: " + apiUrl)

  /**
   * fetch data
   **/

  // prep keyword if necessary

  // start fetching
  const response = yield call(() => api({
    method: "GET",
    url: apiUrl,
  })
    .then(response => ({
      fetchStatus: FetchStatusEnum.SUCCESS,
      data: response.data,
    }))
    .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
  )

  /**
   * update fetch status sucess
   **/
  yield put(
    getCompanyFetchStatusActions.update(response.fetchStatus)
  )

  if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
    console.log(response) // pageable response
    /**
     * update company domain in state
     *
     * - initial fetch use 'update' (e.g., replace)
     * - 'read more' use 'concat' (keep the prevous and concat)
     *
     **/
    yield put(
      companyActions.update(response.data)
    )

  } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
    console.log(response.fetchStatus)
    console.log(response.message)
  }
}





