import { PayloadAction } from "@reduxjs/toolkit";
import { fetchNotificationActionCreator, notificationCurIndexActions, notificationPaginationActions, patchNotificationActionCreator } from "reducers/slices/domain/notification";
import { call, put, select } from "redux-saga/effects";
import { AuthType, UserTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { fetchNotificationWorker } from "./fetchNotificationWorker";
import { NotificationType } from "domain/notification/types";

/**
 * a worker (generator)    
 *
 *  - increment notification cur index. 
 *
 *    - if domain.notifications.data (notification) length == 0 => set default value and done here 
 *
 *    - if notification length -1 == curIndex => curIndex = 0 and done here (can i use 'return' to finish this saga at this point?)
 *
 *    - if notificaiton.length - 1 > curIndex => increment (nextCurIndex)
 *
 *    - if the notification has next page && nextCurIndex == notification.length - 2 => fetch next page and concat
 *  
 *
 **/
export function* incrementNotificationCurIndexWorker(action: PayloadAction<{}>) {

  /**
   * get cur user type
   **/
  const curAuth: AuthType = yield select(rsSelector.app.getAuth)

  /**
   *
   * Admin User Type
   *
   **/
  if (curAuth.userType === UserTypeEnum.ADMIN || curAuth.userType === UserTypeEnum.MEMBER) {

    /**
     * cur index of notificaiton
     **/
    const curIndex = yield select(rsSelector.domain.getNotificationCurIndex) 


    /**
     * get current notification size
     **/
    const curNotificationSize = yield select(mSelector.makeNotificationSizeSelector())

    //- if domain.notifications.data (notification) length == 0 => set default value and done here 
    if (curNotificationSize == 0) {
      yield put(
        notificationCurIndexActions.update(-1)
      )

      return false;
    }

    // if notification length -1 == curIndex => curIndex = 0 and done here (can i use 'return' to finish this saga at this point?)
    if (curNotificationSize - 1 === curIndex) {
      yield put(
        notificationCurIndexActions.update(0)
      )

      return false;
    }

    // - if notificaiton.length - 1 > curIndex => increment (nextCurIndex)
    if (curNotificationSize - 1 > curIndex) {
      yield put(
        notificationCurIndexActions.increment()
      )

      const nextIndex = curIndex + 1;
      const curNotification: NotificationType  = yield select(mSelector.makeNotificationByIndexSelector(nextIndex))

      yield put(
        patchNotificationActionCreator({
          notificationId: curNotification.notificationId,
          userId: curAuth.user.userId,
        })
      )
    }

    //  - if the notification has next page && nextCurIndex == notification.length - 2 => fetch next page and concat
    const curPagination = yield select(rsSelector.domain.getNotificationPagination)
    if (!curPagination.last && curNotificationSize - 2 == curIndex) {

      yield put(
        notificationPaginationActions.incrementPage()
      )
    }
  }
}







