import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { api } from "configs/axiosConfig";
import { filterSingleVariant } from "domain/product";
import { WishlistItemCriteria, WishlistItemType } from "domain/wishlist/types";
import { postWishlistItemFetchStatusActions } from "reducers/slices/app/fetchStatus/wishlistItem";
import { PostWishlistItemActionType, wishlistItemActions } from "reducers/slices/domain/wishlistItem";
import { call, put, select } from "redux-saga/effects";
import { AuthType, FetchStatusEnum, UserTypeEnum, MessageTypeEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { messageActions } from "reducers/slices/app";

/**
 * a worker (generator)    
 *
 *  - post wishlist items of current user 
 *
 *  - NOT gonna use caching since it might be stale soon and the user can update any time.
 *
 *  - (UserType)
 *
 *      - (Guest): add a new data to redux saga 
 *      - (Member): send api request to post a new data and assign response data to the redux saga
 *      - (Admin): N/A
 *
 *  - steps:
 *
 *      (Guest):
 *        
 *        g1. save the new data to redux store
 *
 *      (Member): 
 *
 *        m1. send post request to api to post a new data 
 *
 *        m2. receive the response and save it to redux store
 *
 *  - note:
 *
 *    - payload (e.g., WishlistItemType) does not have any id yet.
 *
 *      (Guest): 
 *
 *        - need to assign the id temporarly (e.g., int, uuidv4). the id is not kept when the user create an account (e.g., member)
 *
 *      (Member):
 *
 *        - don't need to assign the id. the back-end takes care of that.
 *  
 **/
export function* postWishlistItemWorker(action: PayloadAction<PostWishlistItemActionType>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  /**
   *
   * Member User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.MEMBER) {

    /**
     * update status for anime data
     **/
    yield put(
      postWishlistItemFetchStatusActions.update(FetchStatusEnum.FETCHING)
    )

    /**
     * grab all domain
     **/
    const apiUrl = `${API1_URL}/users/${curAuth.user.userId}/wishlistItems`

    /**
     * fetch data
     **/
    try {

      // prep keyword if necessary

      // start fetching
      const response = yield call<(config: AxiosRequestConfig) => AxiosPromise>(api, {
        method: "POST",
        url: apiUrl,
        data: {
          variantId: action.payload.variantId,
        } as WishlistItemCriteria
      })

      /**
       * update categories domain in state
       *
       *  - receive the newly added data as response data
       *
       **/
      yield put(
        wishlistItemActions.updateOne(response.data.data)
      )

      /**
       * update fetch status sucess
       **/
      yield put(
        postWishlistItemFetchStatusActions.update(FetchStatusEnum.SUCCESS)
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
        postWishlistItemFetchStatusActions.update(FetchStatusEnum.FAILED)
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


  } else if (curAuth.userType === UserTypeEnum.GUEST) {

    /**
     * Guest User Type
     **/

    /**
     * create temp id and assign it to the new entity
     **/
    const newEntity = {
      createdAt: new Date(Date.now()),
      product: filterSingleVariant(action.payload.variantId, action.payload.product),
      wishlistItemId: getNanoId(), // temp. don't send to backend.
    } as WishlistItemType

    /**
     * update categories domain in state
     *
     *  - receive the newly added data as response data
     *
     **/
    yield put(
      wishlistItemActions.updateOne(newEntity)
    )


  }
}


