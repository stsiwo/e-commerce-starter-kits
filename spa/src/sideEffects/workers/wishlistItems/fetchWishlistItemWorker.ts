import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { wishlistItemActions, wishlistItemPaginationPageActions, wishlistItemPaginationTotalPagesActions } from "reducers/slices/domain/wishlistItem";
import { call, put, select, all } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { rsSelector, mSelector } from "src/selectors/selector";
import { getWishlistItemFetchStatusActions } from "reducers/slices/app/fetchStatus/wishlistItem";
import { generateQueryString } from "src/utils";

/**
 * a worker (generator)    
 *
 *  - fetch wishlist items of current user 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): N/A 
 *      - (Member): send api request to grab data
 *      - (Admin): N/A
 *
 *  - steps:
 *
 *      (Member): 
 *
 *        m1. send fetch request to api to grab data
 *
 *        m2. receive the response and save it to redux store
 *  
 **/
export function* fetchWishlistItemWorker(action: PayloadAction<{}>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)


  if (curAuth.userType === UserTypeEnum.MEMBER) {

    /**
     * update status for anime data
     **/
    yield put(
      getWishlistItemFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )
    /**
     * prep query string
     **/
    const curQueryString = yield select(mSelector.makeWishlistItemQueryStringSelector())

    console.log(curQueryString)
    console.log(generateQueryString(curQueryString));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/wishlistItems${generateQueryString(curQueryString)}`

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
       * update domain in state
       *
       * don't use 'merge' since no cache
       **/
      yield put(
        wishlistItemActions.update(response.data.data)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        getWishlistItemFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
        put(wishlistItemPaginationPageActions.update(response.data.pageable.pageNumber)),
        put(wishlistItemPaginationTotalPagesActions.update(response.data.totalPages)),
      ])

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        getWishlistItemFetchStatusActions.update(FetchStatusEnum.FAILED)
      )
    }
  }
}


