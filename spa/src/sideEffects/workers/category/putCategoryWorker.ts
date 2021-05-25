import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { CategoryType, NormalizedCategoryType, CategoryCriteria } from "domain/product/types";
import { normalize } from "normalizr";
import { putCategoryFetchStatusActions } from "reducers/slices/app/fetchStatus/category";
import { categoryActions, PutCategoryActionType } from "reducers/slices/domain/category";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum, MessageTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { categorySchemaArray, categorySchemaEntity } from "states/state";
import { messageActions } from "reducers/slices/app";
import { getNanoId } from "src/utils";

/**
 * a worker (generator)    
 *
 *  - put category items of current user 
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
 *        a1. send put request to api to put a new data 
 *
 *        a2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - keep the same id since it is replacement 
 *
 **/
export function* putCategoryWorker(action: PayloadAction<PutCategoryActionType>) {

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
      putCategoryFetchStatusActions.update(FetchStatusEnum.FETCHING)
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
        method: "PUT",
        url: apiUrl,
        data: {
          categoryId: action.payload.categoryId,
          categoryDescription: action.payload.categoryDescription,
          categoryName: action.payload.categoryName,
          categoryPath: action.payload.categoryPath
        } as CategoryCriteria
      })

      /**
       * normalize response data
       *
       *  - TODO: make sure response structure with remote api
       **/
      const normalizedData = normalize(response.data, categorySchemaEntity)

      /**
       * update categories domain in state
       *
       **/
      yield put(
        categoryActions.merge(normalizedData.entities.categories as NormalizedCategoryType)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        putCategoryFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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

    } catch (error) {

      console.log(error)

      /**
       * update fetch status failed
       **/
      yield put(
        putCategoryFetchStatusActions.update(FetchStatusEnum.FAILED)
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



