import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import {
  NormalizedProductType,
  ProductVariantCriteria,
} from "domain/product/types";
import { normalize } from "normalizr";
import { messageActions } from "reducers/slices/app";
import { putProductVariantFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import {
  productActions,
  PutProductVariantActionType,
} from "reducers/slices/domain/product";
import { call, put, select } from "redux-saga/effects";
import {
  AuthType,
  FetchStatusEnum,
  MessageTypeEnum,
  UserTypeEnum,
} from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { productSchemaEntity } from "states/state";

const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - put this domain to create new
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
export function* putProductVariantWorker(
  action: PayloadAction<PutProductVariantActionType>
) {
  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

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
      putProductVariantFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );

    /**
     * grab this domain
     **/
    const apiUrl = `${API1_URL}/products/${action.payload.productId}/variants/${action.payload.variantId}`;

    /**
     * fetch data
     **/

    // start fetching
    const response: WorkerResponse = yield call(() =>
      api({
        method: "PUT",
        url: apiUrl,
        headers: { "If-Match": `"${action.payload.version}"` },
        data: {
          variantId: action.payload.variantId,
          variantColor: action.payload.variantColor,
          productSize: action.payload.productSize,
          variantUnitPrice: action.payload.variantUnitPrice,
          isDiscount: action.payload.isDiscount,
          variantDiscountPrice: action.payload.variantDiscountPrice,
          variantDiscountStartDate: action.payload.variantDiscountStartDate,
          variantDiscountEndDate: action.payload.variantDiscountEndDate,
          variantWeight: action.payload.variantWeight,
          variantHeight: action.payload.variantHeight,
          variantLength: action.payload.variantLength,
          variantWidth: action.payload.variantWidth,
          note: action.payload.note,
          variantStock: action.payload.variantStock,
          productId: action.payload.productId,
          version: action.payload.version,
        } as ProductVariantCriteria,
      })
        .then((response) => ({
          fetchStatus: FetchStatusEnum.SUCCESS,
          data: response.data,
        }))
        .catch((e) => ({
          fetchStatus: FetchStatusEnum.FAILED,
          message: e.response.data.message,
        }))
    );
    /**
     * update fetch status sucess
     **/
    yield put(putProductVariantFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      log("puted product");
      log(response.data);
      /**
       * normalize response data
       *
       *  - TODO: make sure response structure with remote api
       **/
      const normalizedData = normalize(response.data, productSchemaEntity);

      log("normalized product");
      log(normalizedData);

      /**
       * update product domain in state
       *
       **/
      yield put(
        // be careful when normalized a single object, you need to append its domain name (plural) to 'entities'
        productActions.merge(
          normalizedData.entities.products as NormalizedProductType
        )
      );

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "added successfully.",
        })
      );
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {
      log(response.fetchStatus);

      /**
       * update fetch status failed
       **/
      yield put(
        putProductVariantFetchStatusActions.update(FetchStatusEnum.FAILED)
      );
    }
  }
}
