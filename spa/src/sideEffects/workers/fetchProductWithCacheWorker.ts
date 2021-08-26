import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { NormalizedProductType } from "domain/product/types";
import { normalize } from "normalizr";
import { requestTrackerActions } from "reducers/slices/app";
import { getProductFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import {
  productActions,
  productCurItemsActions,
  productPaginationLimitActions,
  productPaginationPageActions,
  productPaginationTotalElementsActions,
  productPaginationTotalPagesActions,
} from "reducers/slices/domain/product";
import { all, call, put, select } from "redux-saga/effects";
import {
  AuthType,
  FetchStatusEnum,
  RequestTrackerBaseType,
  UserTypeEnum,
} from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { generateQueryString } from "src/utils";
import { productSchemaArray } from "states/state";
import { requestUrlCheckWorker } from "./common/requestUrlCheckWorker";
import { logger } from "configs/logger";
const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - fetch all of this domain with cache
 *
 *    - for member/guest user, use 'fetchProductWithCacheWorker' instead for caching feature.
 *
 *  - (ProductType)
 *
 *      - (Guest): send get request and receive all domain and save it to redux store with cache
 *      - (Member): send get request and receive all domain and save it to redux store with cache
 *      - (Admin): N/A
 *
 *  - steps:
 *
 *      (Guest/Member):
 *
 *        a1. check the url is requested before or not
 *
 *        a2. if yes, get data from redux store.
 *
 *        a3. if no, send a request and store it in redux store and also update 'requestUrlTracker'
 *
 **/
export function* fetchProductWithCacheWorker(action: PayloadAction<{}>) {
  /**
   * get cur user type
   *
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

  if (
    curAuth.userType === UserTypeEnum.GUEST ||
    curAuth.userType === UserTypeEnum.MEMBER
  ) {
    /**
     * update status for anime data
     **/
    yield put(getProductFetchStatusActions.update(FetchStatusEnum.FETCHING));

    /**
     * prep query string
     **/
    const curQueryString = yield select(
      mSelector.makeProductQueryStringSelector()
    );

    log(curQueryString);
    log(generateQueryString(curQueryString));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/products${generateQueryString(curQueryString)}`;

    // return empty object if does not exist
    const targetRequestTrackerBase: RequestTrackerBaseType = yield call(
      requestUrlCheckWorker,
      apiUrl
    );

    if (targetRequestTrackerBase) {
      // target url exists

      /**
       * update cur pagination
       **/
      yield all([
        put(
          productPaginationPageActions.update(
            targetRequestTrackerBase.pagination.page
          )
        ),
        put(
          productPaginationLimitActions.update(
            targetRequestTrackerBase.pagination.limit
          )
        ),
        put(
          productPaginationTotalPagesActions.update(
            targetRequestTrackerBase.pagination.totalPages
          )
        ),
      ]);

      /**
       * update cur items
       **/
      yield put(productCurItemsActions.update(targetRequestTrackerBase.ids));

      // currently do nothing
    } else {
      // target url does not exist
      /**
       * fetch data
       **/

      // prep keyword if necessary

      // start fetching
      const response = yield call(() =>
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
      yield put(getProductFetchStatusActions.update(FetchStatusEnum.SUCCESS));
      if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
        /**
         * normalize response data
         *
         *  - TODO: make sure response structure with remote api
         **/
        log(response);
        const normalizedData = normalize(response.content, productSchemaArray);

        /**
         * update product domain in state
         *
         **/
        yield put(
          productActions.merge(
            normalizedData.entities.products as NormalizedProductType
          )
        );

        /**
         * update domain.curItems
         **/
        yield put(productCurItemsActions.update(normalizedData.result));

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
            productPaginationPageActions.update(response.pageable.pageNumber)
          ),
          put(productPaginationTotalPagesActions.update(response.totalPages)),
          put(
            productPaginationTotalElementsActions.update(response.totalPages)
          ),
        ]);

        /**
         * update requestUrlTracker
         *
         **/
        yield put(
          requestTrackerActions.update({
            [apiUrl]: {
              ids: normalizedData.result,
              pagination: {
                page: response.data.pageable.pageNumber,
                limit: curQueryString.limit,
                totalPages: response.data.totalPages,
                totalElements: response.data.totalElements,
              },
            },
          })
        );
      } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
        log(response.message);
      }
    }
  } else {
    log("permission denied. your product type: " + curAuth.userType);
  }
}
