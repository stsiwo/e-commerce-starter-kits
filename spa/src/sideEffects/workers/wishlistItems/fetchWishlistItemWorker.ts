import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { WishlistItemQueryStringType } from "domain/wishlist/types";
import { getWishlistItemFetchStatusActions } from "reducers/slices/app/fetchStatus/wishlistItem";
import {
  wishlistItemActions,
  wishlistItemPaginationPageActions,
  wishlistItemPaginationTotalElementsActions,
  wishlistItemPaginationTotalPagesActions,
} from "reducers/slices/domain/wishlistItem";
import { all, call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { generateQueryString } from "src/utils";

const log = logger(__filename);

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
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

  if (curAuth.userType === UserTypeEnum.MEMBER) {
    /**
     * update status for anime data
     **/
    yield put(
      getWishlistItemFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );
    /**
     * prep query string
     **/
    const curQueryString: WishlistItemQueryStringType = yield select(
      mSelector.makeWishlistItemQueryStringSelector()
    );

    log(curQueryString);
    log(generateQueryString(curQueryString));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${
      curAuth.user.userId
    }/wishlistItems${generateQueryString(curQueryString)}`;

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response: WorkerResponse = yield call(() =>
      api({
        method: "GET",
        url: apiUrl,
      })
        .then((response) => ({
          fetchStatus: FetchStatusEnum.SUCCESS,
          content: response.data.content,
          pageable: response.data.pageable,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        }))
        .catch((e) => ({
          fetchStatus: FetchStatusEnum.FAILED,
          message: e.response.data.message,
        }))
    );

    /**
     * update fetch status sucess
     **/
    yield put(getWishlistItemFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * update domain in state
       *
       * don't use 'merge' since no cache
       **/
      log("wishlist item dto response data");
      log(response.data);
      yield put(wishlistItemActions.update(response.content));

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

      log(response.pageable);

      log("total pages");
      log(response.totalPages);

      yield all([
        put(
          wishlistItemPaginationPageActions.update(response.pageable.pageNumber)
        ),
        put(
          wishlistItemPaginationTotalPagesActions.update(response.totalPages)
        ),
        put(
          wishlistItemPaginationTotalElementsActions.update(
            response.totalElements
          )
        ),
      ]);
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.message);
    }
  }
}
