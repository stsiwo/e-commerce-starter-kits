import { PayloadAction } from "@reduxjs/toolkit";
import { api, WorkerResponse } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { CategoryCriteria, NormalizedCategoryType } from "domain/product/types";
import { normalize } from "normalizr";
import { messageActions } from "reducers/slices/app";
import { postCategoryFetchStatusActions } from "reducers/slices/app/fetchStatus/category";
import {
  categoryActions,
  PostCategoryActionType,
} from "reducers/slices/domain/category";
import { call, put, select } from "redux-saga/effects";
import {
  AuthType,
  FetchStatusEnum,
  MessageTypeEnum,
  UserTypeEnum,
} from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { categorySchemaEntity } from "states/state";

const log = logger(__filename);

/**
 * a worker (generator)
 *
 *  - post category of current user
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
 *        a1. send post request to api to post a new data
 *
 *        a2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - payload (e.g., CategoryType) does not have any id yet.
 *
 **/
export function* postCategoryWorker(
  action: PayloadAction<PostCategoryActionType>
) {
  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth);

  /**
   *
   * Member User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.ADMIN) {
    /**
     * update status for anime data
     **/
    yield put(postCategoryFetchStatusActions.update(FetchStatusEnum.FETCHING));

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/categories`;

    /**
     * fetch data
     **/

    // prep keyword if necessary

    // start fetching
    const response: WorkerResponse = yield call(() =>
      api({
        method: "POST",
        url: apiUrl,
        data: {
          categoryName: action.payload.categoryName,
          categoryPath: action.payload.categoryPath,
          categoryDescription: action.payload.categoryDescription,
        } as CategoryCriteria,
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
    yield put(postCategoryFetchStatusActions.update(response.fetchStatus));

    if (response.fetchStatus === FetchStatusEnum.SUCCESS) {
      /**
       * normalize response data
       *
       *  - TODO: make sure response structure with remote api
       **/
      const normalizedData = normalize(response.data, categorySchemaEntity);

      /**
       * update categories domain in state
       *
       **/
      yield put(
        // be careful when normalized a single object, you need to append its domain name (plural) to 'entities'
        categoryActions.merge(
          normalizedData.entities.categories as NormalizedCategoryType
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
      log(response.message);
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
