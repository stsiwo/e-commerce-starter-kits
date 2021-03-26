import { toggleLeftNavMenuActionTypeName } from 'reducers/slices/ui';
import { takeEvery } from 'redux-saga/effects';
import { leftNavMenuWorkerWorker } from 'sideEffects/workers/leftNavMenuWorker';

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
