import { toggleLeftNavMenuActionTypeName } from 'reducers/slices/ui';
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { leftNavMenuWorkerWorker } from 'sideEffects/workers/leftNavMenuWorker';
import { fetchCategoryActionTypeName } from 'reducers/slices/domain/category';
import { fetchCategoryWorker } from 'sideEffects/workers/fetchCategoryWorker';

/**
 * takeEvery: allows multiple worker instances to be started CONCURRENTLY.
 * takeLatest: cancel pending when there is a new one.
 * throttle: type ahead stuff.
/**
 *  watcher
 **/
export function* leftNavMenuWatcher() {
  yield takeEvery(
    toggleLeftNavMenuActionTypeName,
    leftNavMenuWorkerWorker,
  )
}

export function* categoryFetchWatcher() {
  yield takeLatest(
    fetchCategoryActionTypeName,
    fetchCategoryWorker,
  )
}
