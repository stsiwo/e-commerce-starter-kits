import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "configs/axiosConfig";
import { ProductVariantCriteria } from "domain/product/types";
import { messageActions } from "reducers/slices/app";
import { postProductVariantFetchStatusActions } from "reducers/slices/app/fetchStatus/product";
import { PostProductVariantActionType, productActions } from "reducers/slices/domain/product";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";

/**
 * a worker (generator)    
 *
 *  - post this domain to create new
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
export function* postProductVariantWorker(action: PayloadAction<PostProductVariantActionType>) {

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
     * update status for post product data
     **/
    yield put(
      postProductVariantFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab this domain
     **/
    const apiUrl = `${API1_URL}/products/${action.payload.productId}/variants`

    /**
     * fetch data
     **/


    // start fetching
    const response = yield call(() => api({
      method: "POST",
      url: apiUrl,
      data: {
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
      } as ProductVariantCriteria,
    })
      .then(response => ({ fetchStatus: FetchStatusEnum.SUCCESS, data: response.data }))
      .catch(e => ({ fetchStatus: FetchStatusEnum.FAILED, message: e.response.data.message }))
    )
    /**
     * update fetch status sucess
     **/
    yield put(
      postProductVariantFetchStatusActions.update(response.fetchStatus)
    )

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {

      console.log("posted product")
      console.log(response.data)
      /**
       * update product domain in state
       *
       **/
      yield put(
        productActions.appendVariant({
          productId: action.payload.productId,
          variant: response.data
        })
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "added successfully.",
        })
      )
    } else if (response.fetchStatus === FetchStatusEnum.FAILED) {

      console.log(response.message)

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: response.message
        })
      )
    }
  }
}







