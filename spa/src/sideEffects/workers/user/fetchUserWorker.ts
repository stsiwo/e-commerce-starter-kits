import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { getUserFetchStatusActions } from "reducers/slices/app/fetchStatus/user";
import { userActions, userPaginationTotalPagesActions, userPaginationPageActions, userPaginationTotalElementsActions } from "reducers/slices/domain/user";
import { call, put, select, all } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector, mSelector } from "src/selectors/selector";
import { generateQueryString } from "src/utils";

/**
 * a worker (generator)    
 *
 *  - fetch user items of current user 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): N/A (permission denied) 
 *      - (Member): N/A (permission denied) 
 *      - (Admin): send fetch request and receive data and save it  to redux store
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
export function* fetchUserWorker(action: PayloadAction<{}>) {

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
      getUserFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * prep query string
     **/
    const curQueryString = yield select(mSelector.makeUserQueryStringSelector())

    console.log(curQueryString)
    console.log(generateQueryString(curQueryString));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users${generateQueryString(curQueryString)}`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "GET",
        url: apiUrl,
      })

      /**
       * update user domain in state
       *
       **/
      yield put(
        userActions.merge(response.data.data)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        getUserFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

      /**
       * update pagination.
       *
       * sample response data:
       * 
       * <PageImpl>
       *  <content>
       *    ... actual content
       *  </content>
       *  <pageable>
       *   <sort>
       *   <sorted>true</sorted>
       *   <unsorted>false</unsorted>
       *   <empty>false</empty>
       *   </sort>
       *   <pageNumber>1</pageNumber>
       *   <pageSize>20</pageSize>
       *   <offset>20</offset>
       *   <paged>true</paged>
       *   <unpaged>false</unpaged>
       *  </pageable>
       *  <totalPages>2</totalPages>
       *  <totalElements>25</totalElements>
       *  <last>true</last>
       *  <sort>
       *   <sorted>true</sorted>
       *   <unsorted>false</unsorted>
       *   <empty>false</empty>
       *  </sort>
       *  <first>false</first>
       *  <number>1</number>
       *  <numberOfElements>5</numberOfElements>
       *  <size>20</size>
       *  <empty>false</empty>
       * </PageImpl>
       **/


      console.log(response.data.pageable)

      console.log("total pages")
      console.log(response.data.totalPages)

      yield all([
        put(userPaginationPageActions.update(response.data.pageable.pageNumber)),
        put(userPaginationTotalPagesActions.update(response.data.totalPages)),
        put(userPaginationTotalElementsActions.update(response.data.totalElements)),
      ])
    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        getUserFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  } else {
    console.log("permission denied. your user type: " + curAuth.userType)
  }
}



