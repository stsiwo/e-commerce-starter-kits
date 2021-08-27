/**
 * a worker (generator)
 *
 *  - fetch single domain with cache
 *
 *    - for member/guest user, use 'fetchSingleProductWithCacheWorker' instead for caching feature.
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
//export function* fetchProductWithCacheWorker(action: PayloadAction<{ productPath: string}>) {
//
//  /**
//   * get cur user type
//   *
//   **/
//  const curAuth: AuthType = yield select(rsSelector.app.getAuth)
//
//
//  if (curAuth.userType === UserTypeEnum.GUEST || curAuth.userType === UserTypeEnum.MEMBER) {
//
//    /**
//     * update status for anime data
//     **/
//    yield put(
//      getSingleProductFetchStatusActions.update(FetchStatusEnum.FETCHING)
//    )
//
//    /**
//     * grab this domain
//     **/
//    const apiUrl = `${API1_URL}/products/${action.payload.productPath}`
//
//    // return empty object if does not exist
//    const targetRequestTrackerBase: RequestTrackerBaseType = yield call(requestUrlCheckWorker, apiUrl)
//
//    if (targetRequestTrackerBase) {
//      // target url exists
//
//      // currently do nothing
//    } else {
//      // target url does not exist
//      /**
//       * fetch data
//       **/
//      try {
//
//        // prep keyword if necessary
//
//        // start fetching
//        const response: WorkerResponse = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
//          method: "GET",
//          url: apiUrl,
//        })
//
//        /**
//         * normalize response data
//         *
//         *  - TODO: make sure response structure with remote api
//         **/
//        const normalizedData = normalize(response.data.data, productSchemaArray)
//
//        /**
//         * update product domain in state
//         *
//         **/
//        yield put(
//          productActions.merge(normalizedData.entities.products as NormalizedProductType)
//        )
//
//        /**
//         * update fetch status sucess
//         **/
//        yield put(
//          getSingleProductFetchStatusActions.update(FetchStatusEnum.SUCCESS)
//        )
//
//        /**
//         * update requestUrlTracker
//         *
//         **/
//        yield put(
//          requestTrackerActions.update({
//            [apiUrl]: {
//              ids: normalizedData.result,
//              pagination: {
//                page: response.data.pageable.pageNumber,
//                limit: curQueryString.limit,
//                totalPages: response.data.totalPages,
//              }
//            }
//          })
//        );
//
//      } catch (error) {
//
//
//        /**
//         * update fetch status failed
//         **/
//        yield put(
//          getProductFetchStatusActions.update(FetchStatusEnum.FAILED)
//        )
//      }
//    }
//  } else {
//  }
//}
//
//
//
//
//
//
