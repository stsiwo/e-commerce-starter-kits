import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { messageActions } from "reducers/slices/app";
import { deleteSingleProductVariantFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import {
  DeleteSingleProductVariantActionType,
  productActions,
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
import { logger } from "configs/logger";
const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - delete single product items
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
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
 *        a1. send delete request to api to delete the target entity
 *
 *        a2. receive the response and delete it from redux store if success
 *
 *  - note:
 *
 **/
export function* deleteSingleProductVariantWorker(
  action: PayloadAction<DeleteSingleProductVariantActionType>
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
      deleteSingleProductVariantFetchStatusActions.update(
        FetchStatusEnum.FETCHING
      )
    );

    /**
     * grab this domain
     **/
    const apiUrl = `${API1_URL}/products/${action.payload.productId}/variants/${action.payload.variantId}`;

    /**
     * fetch data
     **/

    // start fetching
    const response = yield call(() =>
      api({
        method: "DELETE",
        url: apiUrl,
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
    yield put(
      deleteSingleProductVariantFetchStatusActions.update(response.fetchStatus)
    );

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      log("puted product");
      log(response.data);
      /**
       * update product domain in state
       *
       **/
      yield put(
        productActions.deleteVariant({
          productId: action.payload.productId,
          variantId: action.payload.variantId,
        })
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
      log(response.message);

      /**
       * update fetch status failed
       **/
      yield put(
        deleteSingleProductVariantFetchStatusActions.update(
          FetchStatusEnum.FAILED
        )
      );

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: response.message,
        })
      );
    }
  }
}
