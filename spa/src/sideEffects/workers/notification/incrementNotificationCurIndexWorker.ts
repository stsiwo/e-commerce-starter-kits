import { PayloadAction } from "@reduxjs/toolkit";
import { logger } from "configs/logger";
import { NotificationType } from "domain/notification/types";
import {
  notificationActions,
  notificationCurIdActions,
  notificationCurNotificationActions,
  notificationPaginationActions,
  patchNotificationActionCreator,
} from "reducers/slices/domain/notification";
import { put, select } from "redux-saga/effects";
import { AuthType, UserTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { DomainPaginationType } from "states/types";
const log = logger(__filename);

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
export function* incrementNotificationCurIndexWorker(
  action: PayloadAction<{}>
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
  if (
    curAuth.userType === UserTypeEnum.ADMIN ||
    curAuth.userType === UserTypeEnum.MEMBER
  ) {
    // extract 1st notification and move it to curNotificaton state
    const firstNotification: NotificationType = yield select(
      mSelector.makeFirstNotificationSelector()
    );

    yield put(notificationCurNotificationActions.update(firstNotification));

    // remove the notification from state
    yield put(notificationActions.removeOne(firstNotification.notificationId));

    // display to client
    yield put(
      notificationCurIdActions.update(firstNotification.notificationId)
    );

    // send patch to turn isRead true
    yield put(
      patchNotificationActionCreator({
        notificationId: firstNotification.notificationId,
        userId: curAuth.user.userId,
      })
    );

    // if pagination is not last && the current notificaiton size = 2, fetch
    const curPagination: DomainPaginationType = yield select(
      rsSelector.domain.getNotificationPagination
    );
    const curNotificationSize: number = yield select(
      mSelector.makeNotificationSizeSelector()
    );

    if (!curPagination.last && curNotificationSize == 2) {
      log("ntf need to increment page");
      yield put(notificationPaginationActions.incrementPage());
    }

    // otherwise, do nothing

    /**
     * cur index of notificaiton
     **/
    //const curIndex: number = yield select(
    //  rsSelector.domain.getNotificationCurIndex
    //);

    ///**
    // * get current notification size
    // **/
    //const curNotificationSize: number = yield select(
    //  mSelector.makeNotificationSizeSelector()
    //);

    //log("current ntc index: " + curIndex);
    //log("current ntc size: " + curNotificationSize);

    ////- if domain.notifications.data (notification) length == 0 => set default value and done here
    //if (curNotificationSize == 0) {
    //  yield put(notificationCurIndexActions.update(-1));

    //  return false;
    //}

    //// if notification length -1 == curIndex => curIndex = 0 and done here (can i use 'return' to finish this saga at this point?)
    //if (curNotificationSize - 1 === curIndex) {
    //  yield put(notificationCurIndexActions.update(0));

    //  return false;
    //}

    //// - if notificaiton.length - 1 > curIndex => increment (nextCurIndex)
    //if (curNotificationSize - 1 > curIndex) {
    //  yield put(notificationCurIndexActions.increment());

    //  const nextIndex = curIndex + 1;
    //  const curNotification: NotificationType = yield select(
    //    mSelector.makeNotificationByIndexSelector(nextIndex)
    //  );

    //  log("next ntf index: " + nextIndex);
    //  log(curNotificationSize);
    //}

    ////  - if the notification has next page && nextCurIndex == notification.length - 2 => fetch next page and concat
    //const curPagination: DomainPaginationType = yield select(
    //  rsSelector.domain.getNotificationPagination
    //);

    //log("cur ntf page: ");
    //log(curPagination);

    //if (!curPagination.last && curNotificationSize - 2 == curIndex) {
    //  log("ntf need to increment page");
    //  yield put(notificationPaginationActions.incrementPage());
    //}
  }
}
