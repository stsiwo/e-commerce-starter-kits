import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { CategoryType } from "domain/product/types";
import { deleteSingleCategoryFetchStatusActions } from "reducers/slices/app/fetchStatus/category";
import { categoryActions, DeleteSingleCategoryActionType } from "reducers/slices/domain/category";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum, MessageTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { messageActions } from "reducers/slices/app";
import { getNanoId } from "src/utils";

/**
 * a worker (generator)    
 *
 *  - delete single category items 
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
export function* deleteSingleCategoryWorker(action: PayloadAction<DeleteSingleCategoryActionType>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  /**
   *
   * Member User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.ADMIN) {

    /**
     * update status for anime data
     **/
    yield put(
      deleteSingleCategoryFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/categories/${action.payload.categoryId}`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "DELETE",
        url: apiUrl,
      })

      /**
       * update categories domain in state
       *
       **/
      yield put(
        categoryActions.delete({
          categoryId: action.payload.categoryId 
        })
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        deleteSingleCategoryFetchStatusActions.update(FetchStatusEnum.SUCCESS)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "deleted successfully.",
        }) 
      )

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        deleteSingleCategoryFetchStatusActions.update(FetchStatusEnum.FAILED)
      )

      /**
       * update message
       **/
      yield put(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: error.message, 
        }) 
      )
    }
  }
}




